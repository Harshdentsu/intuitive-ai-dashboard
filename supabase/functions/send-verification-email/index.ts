
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email } = await req.json();
    console.log(`📧 Processing verification email request for: ${email}`);
    
    if (!email) {
      console.error('❌ No email provided in request');
      return new Response(
        JSON.stringify({ success: false, message: "Email is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Check if email exists in users table
    console.log(`🔍 Checking if email exists in users table: ${email}`);
    const { data: existingUser, error: userError } = await supabase
      .from('users')
      .select('email, role')
      .eq('email', email)
      .single();

    if (userError || !existingUser) {
      console.error('❌ Email not found in system:', userError?.message);
      return new Response(
        JSON.stringify({ success: false, message: "Email not found in system" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`✅ User found with role: ${existingUser.role}`);

    // Generate and store verification token
    console.log('🔑 Generating verification token...');
    const { data: tokenData, error: tokenError } = await supabase
      .from('email_tokens')
      .insert({
        email: email,
        token: crypto.randomUUID(),
        expires_at: new Date(Date.now() + 15 * 60 * 1000).toISOString() // 15 minutes
      })
      .select()
      .single();

    if (tokenError || !tokenData) {
      console.error('❌ Token creation error:', tokenError);
      return new Response(
        JSON.stringify({ success: false, message: "Failed to generate verification token" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`✅ Token created successfully: ${tokenData.token}`);

    // Initialize Resend
    const resendApiKey = Deno.env.get('RESEND_API_KEY');
    if (!resendApiKey) {
      console.error('❌ RESEND_API_KEY not found in environment variables');
      return new Response(
        JSON.stringify({ success: false, message: "Email service not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log('📮 Initializing Resend with API key...');
    const resend = new Resend(resendApiKey);
    
    // Get the origin from request headers
    const origin = req.headers.get('origin') || 'http://localhost:3000';
    const verificationUrl = `${origin}/verify-email?token=${tokenData.token}`;
    
    console.log(`🔗 Verification URL: ${verificationUrl}`);

    // Send verification email
    console.log(`📤 Sending verification email to: ${email}`);
    
    try {
      const emailResponse = await resend.emails.send({
        from: 'Wheely Assistant <onboarding@resend.dev>',
        to: [email],
        subject: 'Verify your email - Wheely Assistant',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #7c3aed;">Verify Your Email</h1>
            <p>Welcome to Wheely Assistant! Please click the link below to verify your email and complete your signup:</p>
            <a href="${verificationUrl}" style="display: inline-block; background-color: #7c3aed; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0;">
              Verify Email
            </a>
            <p style="color: #666; font-size: 14px;">This link will expire in 15 minutes.</p>
            <p style="color: #666; font-size: 12px;">If you didn't request this, please ignore this email.</p>
            <hr style="margin: 20px 0; border: 1px solid #eee;">
            <p style="color: #999; font-size: 11px;">
              Verification Token: ${tokenData.token}<br>
              This email was sent to: ${email}
            </p>
          </div>
        `,
      });

      console.log('✅ Email sent successfully:', JSON.stringify(emailResponse, null, 2));

      return new Response(
        JSON.stringify({ success: true, message: "Verification email sent" }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );

    } catch (emailError) {
      console.error('❌ Resend API error:', JSON.stringify(emailError, null, 2));
      
      // Return more specific error information
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: "Failed to send email",
          error: emailError.message || 'Unknown email service error',
          details: emailError
        }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

  } catch (error) {
    console.error('❌ Unexpected error in send-verification-email:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        message: "Internal server error",
        error: error.message 
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

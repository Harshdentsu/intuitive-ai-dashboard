
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
    
    if (!email) {
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
    const { data: existingUser, error: userError } = await supabase
      .from('users')
      .select('email, role')
      .eq('email', email)
      .single();

    if (userError || !existingUser) {
      return new Response(
        JSON.stringify({ success: false, message: "Email not found in system" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Generate and store verification token
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
      console.error('Token creation error:', tokenError);
      return new Response(
        JSON.stringify({ success: false, message: "Failed to generate verification token" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Send verification email
    const resend = new Resend(Deno.env.get('RESEND_API_KEY'));
    const verificationUrl = `${req.headers.get('origin')}/verify-email?token=${tokenData.token}`;

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
        </div>
      `,
    });

    console.log('Email sent successfully:', emailResponse);

    return new Response(
      JSON.stringify({ success: true, message: "Verification email sent" }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error('Error in send-verification-email:', error);
    return new Response(
      JSON.stringify({ success: false, message: "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

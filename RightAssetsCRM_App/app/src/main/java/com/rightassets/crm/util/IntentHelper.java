package com.rightassets.crm.util;

import android.content.Context;
import android.content.Intent;
import android.net.Uri;
import android.widget.Toast;

/**
 * Native Android Telephony & WhatsApp Intent Launcher
 * Bridges the CRM with device hardware for on-field consultants
 */
public class IntentHelper {

    public static void dialClient(Context context, String phoneNumber) {
        if (phoneNumber == null || phoneNumber.trim().isEmpty()) {
            Toast.makeText(context, "Phone number not available", Toast.LENGTH_SHORT).show();
            return;
        }
        try {
            String sanitized = phoneNumber.replaceAll("[^0-9+]", "");
            Intent dialIntent = new Intent(Intent.ACTION_DIAL, Uri.parse("tel:" + sanitized));
            dialIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            context.startActivity(dialIntent);
        } catch (Exception e) {
            Toast.makeText(context, "Unable to launch phone dialer", Toast.LENGTH_SHORT).show();
        }
    }

    public static void openWhatsAppChat(Context context, String phoneNumber, String clientName, String propertyTitle) {
        if (phoneNumber == null || phoneNumber.trim().isEmpty()) {
            Toast.makeText(context, "WhatsApp number not available", Toast.LENGTH_SHORT).show();
            return;
        }
        try {
            String sanitized = phoneNumber.replaceAll("[^0-9]", "");
            if (sanitized.length() == 10) {
                sanitized = "91" + sanitized;
            }
            String message = "Hello " + clientName + ", I am reaching out from Right Asset's Property Consultants regarding your inquiry for " + propertyTitle + ". When would be a convenient time for a site visit?";
            String url = "https://api.whatsapp.com/send?phone=" + sanitized + "&text=" + Uri.encode(message);
            Intent waIntent = new Intent(Intent.ACTION_VIEW, Uri.parse(url));
            waIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            context.startActivity(waIntent);
        } catch (Exception e) {
            Toast.makeText(context, "Unable to launch WhatsApp", Toast.LENGTH_SHORT).show();
        }
    }
}

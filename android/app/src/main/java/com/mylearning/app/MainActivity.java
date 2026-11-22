package com.mylearning.app;

import android.app.Activity;
import android.os.Bundle;
import android.content.Intent;
import android.content.SharedPreferences;
import android.graphics.Color;
import android.net.Uri;
import android.view.Gravity;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.LinearLayout;
import android.widget.TextView;

/**
 * Launcher for the deployed EduLearn site. Google does not support OAuth login
 * from embedded WebViews, so the content opens in a Chrome Custom Tab / browser.
 * This app does not access or collect Google credentials itself.
 */
public class MainActivity extends Activity {
    private EditText siteField;
    private SharedPreferences prefs;
    private static final String PREF_SITE = "hosted_url";
    @Override public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        prefs = getSharedPreferences("my_learning", MODE_PRIVATE);
        showHome();
        final String saved = prefs.getString(PREF_SITE, "");
        if (!saved.isEmpty() && savedInstanceState == null) {
            openSite(saved);
        }
    }
    private void showHome() {
        LinearLayout root = new LinearLayout(this);
        root.setOrientation(LinearLayout.VERTICAL);
        root.setGravity(Gravity.CENTER_HORIZONTAL);
        root.setPadding(48, 85, 48, 30);
        root.setBackgroundColor(Color.rgb(246, 248, 255));
        TextView title = new TextView(this);
        title.setText("📚 My Learning");
        title.setTextSize(29);
        title.setTextColor(Color.rgb(30, 64, 175));
        title.setGravity(Gravity.CENTER);
        root.addView(title);
        TextView help = new TextView(this);
        help.setText("আপনার EduLearn ওয়েবসাইটের HTTPS লিংক দিন।\n(যেমন: https://your-app.vercel.app)");
        help.setTextSize(16);
        help.setTextColor(Color.rgb(55, 65, 81));
        help.setGravity(Gravity.CENTER);
        help.setPadding(0, 32, 0, 20);
        root.addView(help);
        siteField = new EditText(this);
        siteField.setSingleLine(true);
        siteField.setTextSize(16);
        siteField.setHint("https://your-app.vercel.app");
        siteField.setInputType(android.text.InputType.TYPE_CLASS_TEXT | android.text.InputType.TYPE_TEXT_VARIATION_URI);
        siteField.setText(prefs.getString(PREF_SITE, ""));
        root.addView(siteField, new LinearLayout.LayoutParams(-1, -2));
        Button go = new Button(this);
        go.setText("অ্যাপ খুলুন / Open Learning");
        LinearLayout.LayoutParams params = new LinearLayout.LayoutParams(-1, -2);
        params.topMargin = 24;
        root.addView(go, params);
        go.setOnClickListener(v -> {
            String url = siteField.getText().toString().trim();
            Uri parsed = Uri.parse(url);
            if (!"https".equalsIgnoreCase(parsed.getScheme()) || parsed.getHost() == null || parsed.getHost().isEmpty()) {
                siteField.setError("সম্পূর্ণ HTTPS ওয়েবসাইট লিংক দিন");
                return;
            }
            prefs.edit().putString(PREF_SITE, url).apply();
            openSite(url);
        });
        TextView note = new TextView(this);
        note.setText("ভিডিও, PDF, Login ও Admin Panel চালাতে ওয়েবসাইটটি আগে deploy করতে হবে। Google sign-in এর জন্য browser ব্যবহার করা হয়।");
        note.setTextColor(Color.DKGRAY);
        note.setTextSize(13);
        note.setPadding(0, 35, 0, 0);
        note.setGravity(Gravity.CENTER);
        root.addView(note);
        setContentView(root);
    }
    private void openSite(String url) {
        Uri uri = Uri.parse(url);
        Intent intent = new Intent(Intent.ACTION_VIEW, uri);
        // Chrome Custom Tabs share browser cookies required for Google OAuth.
        Bundle extras = new Bundle();
        extras.putBinder("android.support.customtabs.extra.SESSION", null);
        intent.putExtras(extras);
        intent.putExtra("android.support.customtabs.extra.TOOLBAR_COLOR", Color.rgb(37, 99, 235));
        intent.putExtra("android.support.customtabs.extra.SHARE_MENU_ITEM", false);
        try {
            intent.setPackage("com.android.chrome");
            startActivity(intent);
        } catch (Exception e) {
            intent.setPackage(null);
            try { startActivity(intent); }
            catch (Exception err) { siteField.setError("ইনস্টল করা browser পাওয়া যায়নি"); }
        }
    }
}

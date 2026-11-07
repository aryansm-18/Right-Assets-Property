package com.rightassets.crm.ui.auth

import android.content.Intent
import android.os.Bundle
import android.widget.ArrayAdapter
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import com.rightassets.crm.databinding.ActivityLoginBinding
import com.rightassets.crm.ui.dashboard.DashboardActivity

class LoginActivity : AppCompatActivity() {

    private lateinit var binding: ActivityLoginBinding

    private val advisors = listOf(
        "Sanjeev Mehta (Admin • Owner)",
        "Nutan Madam (Associate • Resale Lead)",
        "Roshan (Associate • Rental Specialist)",
        "Krutika (Associate • Digital Marketer)"
    )

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityLoginBinding.inflate(layoutInflater)
        setContentView(binding.root)

        // Setup Advisor Spinner
        val adapter = ArrayAdapter(this, android.R.layout.simple_spinner_dropdown_item, advisors)
        binding.spinnerAdvisor.adapter = adapter

        binding.btnLogin.setOnClickListener {
            val selectedAdvisor = binding.spinnerAdvisor.selectedItem.toString()
            val pin = binding.editPin.text.toString().trim()

            // For development demo: PIN 1234 or empty allows access
            if (pin.isEmpty() || pin == "1234") {
                val intent = Intent(this, DashboardActivity::class.java).apply {
                    putExtra("EXTRA_ADVISOR", selectedAdvisor)
                }
                startActivity(intent)
                finish()
            } else {
                Toast.makeText(this, "Invalid PIN! Use 1234 for demo login", Toast.LENGTH_SHORT).show()
            }
        }
    }
}

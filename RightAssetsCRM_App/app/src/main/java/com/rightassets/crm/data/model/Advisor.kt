package com.rightassets.crm.data.model

data class Advisor(
    val id: String = "",
    val name: String = "",
    val role: String = "Staff", // "Admin" for Sanjeev Mehta, "Staff" for Nutan, Roshan, Krutika
    val title: String = "",
    val phone: String = "",
    val whatsapp: String = "",
    val specialization: String = "",
    val email: String = "",
    val status: String = "Active"
)

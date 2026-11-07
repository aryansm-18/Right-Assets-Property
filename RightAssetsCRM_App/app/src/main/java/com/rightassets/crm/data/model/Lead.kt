package com.rightassets.crm.data.model

data class Lead(
    val id: String = "",
    val clientName: String = "",
    val phone: String = "",
    val email: String = "",
    val purpose: String = "",
    val category: String = "",
    val budget: String = "",
    val propertyTitle: String = "",
    val preferredArea: String = "",
    val message: String = "",
    var status: String = "New",
    var notes: String = "",
    val assignedTo: String = "",
    val createdAt: String = "",
    val timestamp: Long = 0L,
    val aiScore: Int = 85
)

package com.rightassets.crm.data.model

data class Property(
    val id: String = "",
    val title: String = "",
    val slug: String = "",
    val category: String = "",
    val purpose: String = "",
    val price: Long = 0L,
    val priceDisplay: String = "",
    val location: String = "",
    val zone: String = "",
    val area: Int = 0,
    val bedrooms: Int = 0,
    val bathrooms: Int = 0,
    val parking: Int = 0,
    val furnishing: String = "",
    val possession: String = "",
    val reraId: String = "",
    val featured: Boolean = false,
    val rating: Double = 4.5,
    val tagline: String = "",
    val description: String = ""
)

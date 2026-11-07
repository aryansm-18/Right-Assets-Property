package com.rightassets.crm.data.repository

import com.google.firebase.database.*
import com.rightassets.crm.data.model.Advisor
import com.rightassets.crm.data.model.Lead
import com.rightassets.crm.data.model.Property
import kotlinx.coroutines.channels.awaitClose
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.callbackFlow

class CrmRepository {

    private val database: FirebaseDatabase = FirebaseDatabase.getInstance()
    private val leadsRef: DatabaseReference = database.getReference("leads")
    private val propertiesRef: DatabaseReference = database.getReference("properties")
    private val advisorsRef: DatabaseReference = database.getReference("advisors")

    // Real-time flow of all leads with fallback parsing to prevent crashes
    fun getLeadsFlow(): Flow<List<Lead>> = callbackFlow {
        val listener = object : ValueEventListener {
            override fun onDataChange(snapshot: DataSnapshot) {
                val list = mutableListOf<Lead>()
                for (child in snapshot.children) {
                    try {
                        val lead = child.getValue(Lead::class.java)
                        if (lead != null) {
                            list.add(lead)
                        } else {
                            val map = child.value as? Map<*, *>
                            if (map != null) {
                                val fallbackLead = Lead(
                                    id = child.key ?: "",
                                    clientName = map["clientName"]?.toString() ?: "Prospective Client",
                                    phone = map["phone"]?.toString() ?: "+91 8879541828",
                                    email = map["email"]?.toString() ?: "",
                                    purpose = map["purpose"]?.toString() ?: "Property Inquiry",
                                    category = map["category"]?.toString() ?: "Residential",
                                    budget = map["budget"]?.toString() ?: "Flexible",
                                    propertyTitle = map["propertyTitle"]?.toString() ?: "Inquiry in Kandivali",
                                    preferredArea = map["preferredArea"]?.toString() ?: "Kandivali West",
                                    status = map["status"]?.toString() ?: "New Lead",
                                    notes = map["notes"]?.toString() ?: "",
                                    assignedTo = map["assignedTo"]?.toString() ?: "Sanjeev Mehta",
                                    createdAt = map["createdAt"]?.toString() ?: "",
                                    aiScore = (map["aiScore"] as? Number)?.toInt() ?: 85
                                )
                                list.add(fallbackLead)
                            }
                        }
                    } catch (e: Exception) {
                        e.printStackTrace()
                    }
                }
                trySend(list)
            }

            override fun onCancelled(error: DatabaseError) {
                close(error.toException())
            }
        }
        leadsRef.addValueEventListener(listener)
        awaitClose { leadsRef.removeEventListener(listener) }
    }

    // Update lead status (e.g. New -> Site Visit -> Price Negotiation -> Closed)
    fun updateLeadStatus(leadId: String, newStatus: String, notes: String, onComplete: (Boolean) -> Unit) {
        val updates = mapOf<String, Any>(
            "status" to newStatus,
            "notes" to notes
        )
        leadsRef.child(leadId).updateChildren(updates).addOnCompleteListener { task ->
            onComplete(task.isSuccessful)
        }
    }

    // Real-time flow of properties for AI Smart Matcher
    fun getPropertiesFlow(): Flow<List<Property>> = callbackFlow {
        val listener = object : ValueEventListener {
            override fun onDataChange(snapshot: DataSnapshot) {
                val list = mutableListOf<Property>()
                for (child in snapshot.children) {
                    val prop = child.getValue(Property::class.java)
                    if (prop != null) list.add(prop)
                }
                trySend(list)
            }

            override fun onCancelled(error: DatabaseError) {
                close(error.toException())
            }
        }
        propertiesRef.addValueEventListener(listener)
        awaitClose { propertiesRef.removeEventListener(listener) }
    }
}

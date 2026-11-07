package com.rightassets.crm.ui.dashboard

import android.view.LayoutInflater
import android.view.ViewGroup
import androidx.recyclerview.widget.RecyclerView
import com.rightassets.crm.data.model.Lead
import com.rightassets.crm.databinding.ItemLeadCardBinding
import com.rightassets.crm.util.IntentHelper

class LeadsAdapter(
    private var leads: List<Lead>,
    private val onItemClick: (Lead) -> Unit
) : RecyclerView.Adapter<LeadsAdapter.LeadViewHolder>() {

    fun updateData(newLeads: List<Lead>) {
        leads = newLeads
        notifyDataSetChanged()
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): LeadViewHolder {
        val binding = ItemLeadCardBinding.inflate(LayoutInflater.from(parent.context), parent, false)
        return LeadViewHolder(binding)
    }

    override fun onBindViewHolder(holder: LeadViewHolder, position: Int) {
        holder.bind(leads[position])
    }

    override fun getItemCount(): Int = leads.size

    inner class LeadViewHolder(private val binding: ItemLeadCardBinding) :
        RecyclerView.ViewHolder(binding.root) {

        fun bind(lead: Lead) {
            binding.leadClientName.text = lead.clientName
            binding.leadPropertyTitle.text = lead.propertyTitle
            binding.leadBudget.text = "Budget: ${lead.budget} • ${lead.preferredArea}"
            binding.leadAiScore.text = "${lead.aiScore}% Match"

            // Native Phone Dialer Intent
            binding.btnCall.setOnClickListener {
                IntentHelper.dialClient(itemView.context, lead.phone)
            }

            // Native WhatsApp Intent
            binding.btnWhatsapp.setOnClickListener {
                IntentHelper.openWhatsAppChat(itemView.context, lead.phone, lead.clientName, lead.propertyTitle)
            }

            itemView.setOnClickListener {
                onItemClick(lead)
            }
        }
    }
}

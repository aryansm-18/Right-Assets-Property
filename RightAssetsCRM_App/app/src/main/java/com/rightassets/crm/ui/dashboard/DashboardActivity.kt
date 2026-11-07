package com.rightassets.crm.ui.dashboard

import android.os.Bundle
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.lifecycle.lifecycleScope
import androidx.recyclerview.widget.LinearLayoutManager
import com.rightassets.crm.data.model.Lead
import com.rightassets.crm.data.repository.CrmRepository
import com.rightassets.crm.databinding.ActivityDashboardBinding
import kotlinx.coroutines.flow.catch
import kotlinx.coroutines.launch

class DashboardActivity : AppCompatActivity() {

    private lateinit var binding: ActivityDashboardBinding
    private val repository = CrmRepository()
    private lateinit var adapter: LeadsAdapter

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityDashboardBinding.inflate(layoutInflater)
        setContentView(binding.root)

        val advisorName = intent.getStringExtra("EXTRA_ADVISOR") ?: "Sanjeev Mehta (Owner)"
        binding.textAdvisorName.text = advisorName

        setupRecyclerView()
        observeLiveLeads()
    }

    private fun setupRecyclerView() {
        adapter = LeadsAdapter(emptyList()) { lead ->
            Toast.makeText(this, "Selected: ${lead.clientName} (${lead.status})", Toast.LENGTH_SHORT).show()
        }
        binding.recyclerLeads.layoutManager = LinearLayoutManager(this)
        binding.recyclerLeads.adapter = adapter
    }

    private fun observeLiveLeads() {
        lifecycleScope.launch {
            repository.getLeadsFlow()
                .catch { e ->
                    binding.textPipelineStats.text = "Offline Mode • Connecting to cloud..."
                }
                .collect { leads ->
                    binding.textPipelineStats.text = "Live Sync Active • ${leads.size} Total Leads in Cloud"
                    binding.kpiTotalLeads.text = leads.size.toString()
                    val visits = leads.count { it.status.contains("Visit", ignoreCase = true) }
                    binding.kpiActiveVisits.text = visits.toString()
                    adapter.updateData(leads)
                }
        }
    }
}

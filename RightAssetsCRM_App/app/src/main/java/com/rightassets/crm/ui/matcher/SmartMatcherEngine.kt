package com.rightassets.crm.ui.matcher

import com.rightassets.crm.data.model.Lead
import com.rightassets.crm.data.model.Property

data class PropertyMatchResult(
    val property: Property,
    val matchScore: Int,
    val matchReasons: List<String>
)

object SmartMatcherEngine {

    fun findTopMatches(lead: Lead, allProperties: List<Property>, topN: Int = 3): List<PropertyMatchResult> {
        val results = mutableListOf<PropertyMatchResult>()

        val leadLoc = lead.preferredArea.lowercase()
        val leadCat = lead.category.lowercase()
        val leadPurp = lead.purpose.lowercase()

        for (p in allProperties) {
            var score = 50
            val reasons = mutableListOf<String>()

            // 1. Purpose Match
            if (p.purpose.lowercase() == leadPurp) {
                score += 20
                reasons.add("Purpose Aligned: ${p.purpose.uppercase()}")
            }

            // 2. Category Match
            if (p.category.lowercase() == leadCat) {
                score += 15
                reasons.add("Asset Category: ${p.category.uppercase()}")
            }

            // 3. Location / Zone Proximity
            val propLoc = (p.location + " " + p.zone).lowercase()
            if (leadLoc.isNotEmpty() && (propLoc.contains("kandivali") && leadLoc.contains("kandivali") ||
                        propLoc.contains("borivali") && leadLoc.contains("borivali") ||
                        propLoc.contains("charkop") && leadLoc.contains("charkop") ||
                        propLoc.contains("mahavir") && leadLoc.contains("mahavir"))) {
                score += 15
                reasons.add("Corridor Proximity: ${p.zone}")
            }

            results.add(PropertyMatchResult(property = p, matchScore = minOf(score, 99), matchReasons = reasons))
        }

        return results.sortedByDescending { it.matchScore }.take(topN)
    }
}

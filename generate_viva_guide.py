# -*- coding: utf-8 -*-
"""
Generate Viva Voce Master Preparation Guide PDF
For Aryan Mehta (Roll No: 17030925018)
Right Asset's Property - Web Portal & Android Mobile CRM
"""

import os
from reportlab.lib.pagesizes import letter
from reportlab.lib.units import inch
from reportlab.lib.colors import HexColor
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_JUSTIFY, TA_LEFT, TA_RIGHT
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, PageBreak, Table, TableStyle, KeepTogether, HRFlowable
)
from reportlab.pdfgen import canvas

class VivaNumberedCanvas(canvas.Canvas):
    def __init__(self, *args, **kwargs):
        super(VivaNumberedCanvas, self).__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_page_decorations(num_pages)
            super(VivaNumberedCanvas, self).showPage()
        super(VivaNumberedCanvas, self).save()

    def draw_page_decorations(self, page_count):
        self.saveState()
        self.setFont("Times-Roman", 9)
        self.setFillColor(HexColor("#4A5568"))

        # Top Running Header
        header_text = "Right Asset's Property — External Viva Voce Preparation Guide (50 Marks)"
        self.drawString(inch, 11 * inch - 0.65 * inch, header_text)
        self.setStrokeColor(HexColor("#CBD5E1"))
        self.setLineWidth(0.6)
        self.line(inch, 11 * inch - 0.72 * inch, 8.5 * inch - inch, 11 * inch - 0.72 * inch)

        # Bottom Running Footer
        footer_text = "Candidate: Aryan Mehta (Roll No: 17030925018) | KJSIM MCA 2025-2027"
        page_str = f"Page {self._pageNumber} of {page_count}"
        self.drawString(inch, 0.65 * inch, footer_text)
        self.drawRightString(8.5 * inch - inch, 0.65 * inch, page_str)
        self.line(inch, 0.75 * inch, 8.5 * inch - inch, 0.75 * inch)
        self.restoreState()


def build_viva_pdf(pdf_path):
    doc = SimpleDocTemplate(
        pdf_path,
        pagesize=letter,
        leftMargin=inch,
        rightMargin=inch,
        topMargin=inch,
        bottomMargin=inch
    )

    styles = getSampleStyleSheet()

    style_normal = ParagraphStyle(
        'VNormal',
        parent=styles['Normal'],
        fontName='Times-Roman',
        fontSize=11,
        leading=16,
        alignment=TA_JUSTIFY,
        spaceAfter=8,
        textColor=HexColor('#1A202C')
    )

    style_heading = ParagraphStyle(
        'VHeading',
        parent=styles['Heading1'],
        fontName='Times-Bold',
        fontSize=14,
        leading=18,
        alignment=TA_LEFT,
        spaceBefore=14,
        spaceAfter=6,
        textColor=HexColor('#7B1113'),
        keepWithNext=True
    )

    style_subheading = ParagraphStyle(
        'VSubHeading',
        parent=styles['Heading2'],
        fontName='Times-Bold',
        fontSize=12,
        leading=16,
        alignment=TA_LEFT,
        spaceBefore=10,
        spaceAfter=4,
        textColor=HexColor('#2D3748'),
        keepWithNext=True
    )

    style_q = ParagraphStyle(
        'VQ',
        parent=styles['Normal'],
        fontName='Times-Bold',
        fontSize=11,
        leading=16,
        alignment=TA_LEFT,
        spaceBefore=8,
        spaceAfter=4,
        textColor=HexColor('#7B1113')
    )

    style_code_box = ParagraphStyle(
        'VCode',
        parent=styles['Normal'],
        fontName='Courier-Bold',
        fontSize=9.5,
        leading=13,
        textColor=HexColor('#0F172A')
    )

    story = []

    # Title Banner
    story.append(Paragraph("MCA MINI PROJECT VIVA VOCE MASTER GUIDE", ParagraphStyle(
        'VTitle', fontName='Times-Bold', fontSize=18, leading=22, alignment=TA_CENTER, textColor=HexColor('#7B1113')
    )))
    story.append(Spacer(1, 0.05 * inch))
    story.append(Paragraph("Right Asset's Property: Web Portal & Cross-Platform Mobile CRM", ParagraphStyle(
        'VSub', fontName='Times-Bold', fontSize=12, leading=16, alignment=TA_CENTER, textColor=HexColor('#2D3748')
    )))
    story.append(Spacer(1, 0.05 * inch))
    story.append(Paragraph("Candidate: <b>Aryan Mehta</b> | Roll No: <b>17030925018</b> | Mentor: <b>Dr. Jaya Iyer</b> | Program Director: <b>Dr. Kirti Wankhede</b>", ParagraphStyle(
        'VMeta', fontName='Times-Roman', fontSize=10, leading=14, alignment=TA_CENTER, textColor=HexColor('#4A5568')
    )))
    story.append(Spacer(1, 0.15 * inch))
    story.append(HRFlowable(width="100%", thickness=1, color=HexColor('#7B1113'), spaceAfter=10))

    # SECTION 1: 2-MINUTE VIVA ELEVATOR PITCH
    story.append(Paragraph("1. THE PERFECT 2-MINUTE OPENING PITCH", style_heading))
    p_pitch = (
        "When the external examiners ask: <i>'Aryan, introduce yourself and explain what you have built in this project'</i>, "
        "speak calmly with confidence and deliver this structured answer:<br/><br/>"
        "<i>\"Respected Examiners and Mentors, Good Morning. My name is Aryan Mehta, Roll No 18. "
        "For my MCA Mini Project under the guidance of Dr. Jaya Iyer, I developed <b>Right Asset's Property</b>, "
        "an end-to-end real estate discovery web platform and native Android mobile CRM.<br/><br/>"
        "In Mumbai's western suburbs, especially Kandivali, Borivali, and Malad, buyers face duplicate listings, "
        "fake pricing, and unverified broker claims. To solve this, my project implements a strict <b>Three-Tier Architecture</b>:<br/>"
        "1. <b>Public Web Discovery Portal:</b> A responsive web app built with HTML5, CSS3, and modern JavaScript. "
        "It features 100 verified listings, a rule-based AI advisor named 'Righty' that parses natural language queries, and "
        "an automated Maharashtra Stamp Duty & Loan EMI calculator.<br/>"
        "2. <b>Cloud Synchronization Layer:</b> Powered by Google Firebase Realtime Database with NoSQL schema for live "
        "two-way sync across leads, properties, and advisor accounts.<br/>"
        "3. <b>Native Android Executive CRM:</b> Built in Android Studio using Kotlin and Java with MVVM architecture. "
        "It allows on-field property advisors to manage client inquiry pipelines with one-touch phone dialers and WhatsApp launchers.<br/><br/>"
        "This completely decouples sensitive business records and lead pipelines from the public website while keeping everything in real-time sync.</i>\""
    )
    story.append(Paragraph(p_pitch, style_normal))
    story.append(Spacer(1, 0.1 * inch))

    # SECTION 2: ARCHITECTURE & MARKS BREAKDOWN
    story.append(Paragraph("2. HOW EXTERNALS EVALUATE THE 50 MARKS", style_heading))
    marks_data = [
        [Paragraph("<b>Evaluation Parameter</b>", style_normal), Paragraph("<b>Marks</b>", style_normal), Paragraph("<b>What Examiners Look For in Your Project</b>", style_normal)],
        [
            Paragraph("System Architecture & Design", style_normal),
            Paragraph("10 Marks", style_normal),
            Paragraph("Separation of concerns (Web for clients vs Android for advisors), NoSQL schema, and MVVM design pattern.", style_normal)
        ],
        [
            Paragraph("Frontend & Mobile UI", style_normal),
            Paragraph("10 Marks", style_normal),
            Paragraph("Responsive web portal, interactive property filtering, luxury gold/dark UI theme, and clean Material 3 Android screens.", style_normal)
        ],
        [
            Paragraph("Database & Cloud Sync", style_normal),
            Paragraph("10 Marks", style_normal),
            Paragraph("Firebase Realtime Database integration, live updates via RESTful and WebSocket listeners, no data loss.", style_normal)
        ],
        [
            Paragraph("Code Quality & Logic", style_normal),
            Paragraph("10 Marks", style_normal),
            Paragraph("Rule-based regex NLP in Righty AI, accurate Maharashtra Stamp Duty formula, Kotlin coroutines & flow.", style_normal)
        ],
        [
            Paragraph("Viva Defense & Q&A", style_normal),
            Paragraph("10 Marks", style_normal),
            Paragraph("Confidence in locating functions in code files, answering technical design questions, and explaining practical use.", style_normal)
        ]
    ]
    t_marks = Table(marks_data, colWidths=[1.8 * inch, 0.9 * inch, 3.8 * inch])
    t_marks.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), HexColor('#F1F5F9')),
        ('GRID', (0, 0), (-1, -1), 0.5, HexColor('#CBD5E1')),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('TOPPADDING', (0, 0), (-1, -1), 4),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
    ]))
    story.append(t_marks)
    story.append(PageBreak())

    # SECTION 3: CODE MAP (EXACT FILES & FUNCTIONS)
    story.append(Paragraph("3. CODE COMPASS: EXACT FILES & IMPORTANT FUNCTIONS", style_heading))
    p_code_intro = (
        "If the external examiner says: <i>'Open your project in VS Code or Android Studio and show me where X is implemented'</i>, "
        "refer directly to this cheat-sheet:"
    )
    story.append(Paragraph(p_code_intro, style_normal))

    code_data = [
        [Paragraph("<b>Feature / Module</b>", style_normal), Paragraph("<b>File Location</b>", style_normal), Paragraph("<b>Key Functions / Classes</b>", style_normal)],
        [
            Paragraph("<b>Righty AI Real Estate Chatbot</b>", style_normal),
            Paragraph("<code>assets/js/ai-assistant.js</code>", style_code_box),
            Paragraph("<code>generateResponse(msg)</code><br/><code>parseBudgetQuery()</code><br/><code>filterByMetroProximity()</code>", style_code_box)
        ],
        [
            Paragraph("<b>Stamp Duty & Loan Calculator</b>", style_normal),
            Paragraph("<code>assets/js/calculators.js</code>", style_code_box),
            Paragraph("<code>calculateStampDuty()</code><br/><code>calculateEMI()</code><br/><code>generateAmortizationSchedule()</code>", style_code_box)
        ],
        [
            Paragraph("<b>Firebase Sync & Lead Management</b>", style_normal),
            Paragraph("<code>assets/js/leads-service.js</code>", style_code_box),
            Paragraph("<code>RealtimeDB.syncFromFirebase()</code><br/><code>LeadService.saveLead()</code><br/><code>AuthService.login()</code>", style_code_box)
        ],
        [
            Paragraph("<b>100 Verified Listings Dataset</b>", style_normal),
            Paragraph("<code>assets/js/data.js</code>", style_code_box),
            Paragraph("<code>PROPERTIES_DATA</code> array containing 100 normalized objects with RERA carpet, price, & advisor.", style_code_box)
        ],
        [
            Paragraph("<b>Property Filter & Render Engine</b>", style_normal),
            Paragraph("<code>assets/js/properties.js</code>", style_code_box),
            Paragraph("<code>renderPropertyList()</code><br/><code>applyFilters()</code><br/><code>sortProperties()</code>", style_code_box)
        ],
        [
            Paragraph("<b>Android Firebase Repository</b>", style_normal),
            Paragraph("<code>.../data/repository/ CrmRepository.kt</code>", style_code_box),
            Paragraph("<code>getLeadsFlow(): Flow&lt;List&lt;Lead&gt;&gt;</code><br/><code>updateLeadStatus()</code><br/><code>getPropertiesFlow()</code>", style_code_box)
        ],
        [
            Paragraph("<b>Android Smart Matcher Engine</b>", style_normal),
            Paragraph("<code>.../matcher/ SmartMatcherEngine.kt</code>", style_code_box),
            Paragraph("<code>matchPropertiesForLead(lead, allProps)</code> computes compatibility score based on budget & location.", style_code_box)
        ],
        [
            Paragraph("<b>Android Native Telephony & WhatsApp</b>", style_normal),
            Paragraph("<code>.../util/ IntentHelper.java</code>", style_code_box),
            Paragraph("<code>launchPhoneDialer(context, phone)</code><br/><code>launchWhatsAppChat(context, phone, msg)</code>", style_code_box)
        ],
        [
            Paragraph("<b>Android Lead Pipeline Screen</b>", style_normal),
            Paragraph("<code>.../ui/leads/ LeadsAdapter.kt</code>", style_code_box),
            Paragraph("<code>onBindViewHolder()</code> binds lead cards, stage chips, & one-touch action buttons.", style_code_box)
        ]
    ]
    t_code = Table(code_data, colWidths=[1.8 * inch, 2.3 * inch, 2.4 * inch])
    t_code.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), HexColor('#F1F5F9')),
        ('GRID', (0, 0), (-1, -1), 0.5, HexColor('#CBD5E1')),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('TOPPADDING', (0, 0), (-1, -1), 4),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
    ]))
    story.append(t_code)
    story.append(Spacer(1, 0.1 * inch))

    # SECTION 4: EXPECTED QUESTIONS & ANSWERS (TOP 12)
    story.append(Paragraph("4. TOP 12 EXPECTED VIVA QUESTIONS & ANSWERS", style_heading))

    qas = [
        (
            "Q1. Why did you choose a three-tier architecture with a separate web portal and mobile app?",
            "<b>Answer:</b> In a real estate business, there is a clear difference between what a home buyer needs and what a real estate advisor needs. "
            "Home buyers need a fast, public website to browse properties and calculate stamp duty without logging in. "
            "Property advisors need a private, secure mobile CRM on their smartphones to view client phone numbers, budgets, and change deal stages on the go. "
            "Separating them keeps client data confidential and ensures the public website stays lightweight while Firebase keeps both platforms in real-time sync."
        ),
        (
            "Q2. How is 'Righty' AI implemented? Is it using OpenAI or third-party cloud APIs?",
            "<b>Answer:</b> 'Righty' is engineered using a deterministic rule-based natural language processing engine running directly in the browser via JavaScript "
            "in <code>ai-assistant.js</code>. It avoids expensive third-party APIs and network delays. It tokenizes user input and matches keywords for locations, "
            "budgets, and metro stations on Line 2A. For example, if a user types '2 BHK in Kandivali under 2 Cr', regex extractors parse the budget number, "
            "bedroom count, and locality, immediately returning verified matches from the 100-property dataset."
        ),
        (
            "Q3. How does the Stamp Duty and Registration calculator work?",
            "<b>Answer:</b> The calculator in <code>calculators.js</code> strictly implements the Maharashtra Stamp Act revenue rules. "
            "For male or joint buyers, stamp duty is 6% (5% base + 1% Mumbai Metro Cess). Female individual buyers receive a statutory 1% concession, "
            "paying 5% total. Registration charges are computed as 1% of the agreement value, with a government-mandated cap of Rs. 30,000 for properties "
            "above Rs. 30 Lakhs."
        ),
        (
            "Q4. Can you write and explain the Home Loan EMI formula?",
            "<b>Answer:</b> Yes. The EMI calculation uses the compound reducing balance formula:<br/>"
            "<b>EMI = [ P &times; r &times; (1 + r)<sup>n</sup> ] / [ (1 + r)<sup>n</sup> &minus; 1 ]</b><br/>"
            "Where <b>P</b> is Principal loan amount, <b>r</b> is monthly interest rate (Annual Rate &divide; 12 &divide; 100), and <b>n</b> is total months. "
            "Our JavaScript function updates the monthly installment and total interest dynamically as the user moves the slider."
        ),
        (
            "Q5. How does the Android App communicate with Firebase Realtime Database?",
            "<b>Answer:</b> In Android Studio, we use the official Firebase Android SDK. In <code>CrmRepository.kt</code>, we attach a "
            "<code>ValueEventListener</code> to the database reference <code>database.getReference(\"leads\")</code>. "
            "Using Kotlin Coroutines and <code>callbackFlow</code>, any new lead submitted on the website emits a live update to our ViewModel, "
            "which immediately updates the RecyclerView in the mobile app without manual refreshing."
        ),
        (
            "Q6. What happens if the advisor's phone is offline without internet?",
            "<b>Answer:</b> Firebase Realtime Database has built-in offline disk persistence. In Android, Firebase keeps a local cache of recent data. "
            "When the advisor makes changes or views leads offline, updates are queued locally and automatically pushed to the cloud once the connection is restored. "
            "Similarly, the web frontend uses <code>localStorage</code> as a fallback if the network is disconnected."
        ),
        (
            "Q7. What is MVVM Architecture in Android and why did you use it?",
            "<b>Answer:</b> MVVM stands for Model-View-ViewModel. <br/>"
            "• <b>Model:</b> The data classes (<code>Lead.kt</code>, <code>Property.kt</code>) and repository (<code>CrmRepository.kt</code>).<br/>"
            "• <b>View:</b> The Activities and XML layouts that show the UI to the user.<br/>"
            "• <b>ViewModel:</b> Manages UI-related data in a lifecycle-conscious way and communicates between Model and View.<br/>"
            "We used MVVM because it separates UI logic from business logic, prevents memory leaks when rotating the screen, and makes unit testing easier."
        ),
        (
            "Q8. How does the one-touch calling and WhatsApp feature work in the Android app?",
            "<b>Answer:</b> It uses standard Android Implicit Intents in <code>IntentHelper.java</code>. "
            "For calling, we create an <code>Intent(Intent.ACTION_DIAL, Uri.parse(\"tel:\" + phoneNumber))</code> which opens the native dialer without requiring "
            "dangerous call permissions. For WhatsApp, we launch <code>Intent.ACTION_VIEW</code> with a universal <code>https://wa.me/&lt;phone&gt;?text=&lt;msg&gt;</code> "
            "URI, pre-filling the client's name and property inquiry automatically."
        ),
        (
            "Q9. What are the MahaRERA details and statutory compliance in your project?",
            "<b>Answer:</b> Right Asset's Property operates under official MahaRERA Agent Registration <b>A51800000620</b> (valid through 2028) "
            "and REAAK (Real Estate Agents Association of Kandivali) Membership <b>RM No. 204</b>. All 100 properties in our catalog display certified "
            "RERA carpet areas rather than ambiguous super built-up measurements, complying with the MahaRERA Act 2016."
        ),
        (
            "Q10. Why did you use NoSQL (Firebase) instead of MySQL or PostgreSQL?",
            "<b>Answer:</b> Real estate lead inquiries and property listings have semi-structured data with varying attributes across residential, commercial, "
            "and land categories. Firebase NoSQL allows rapid document and key-value mapping, real-time WebSocket change notifications, and serverless hosting "
            "without maintaining a dedicated relational database server."
        ),
        (
            "Q11. What is the AI Smart Property Matcher in the mobile app?",
            "<b>Answer:</b> In <code>SmartMatcherEngine.kt</code>, when an advisor opens a client lead, the engine compares the client's budget and corridor preference "
            "with the active property inventory. It assigns a compatibility score (out of 100) based on budget fit and corridor alignment, displaying the top 3 "
            "matching properties so the advisor can pitch them during the phone call."
        ),
        (
            "Q12. What are the Future Scope enhancements planned for this system?",
            "<b>Answer:</b> Three major enhancements are planned:<br/>"
            "1. <b>Firebase Cloud Messaging (FCM):</b> Push notifications to advisors' phones the second a lead arrives.<br/>"
            "2. <b>Blockchain Title Registry:</b> Storing society share certificate hashes on Polygon/Ethereum to eliminate duplicate property sales.<br/>"
            "3. <b>WebGL 360-degree Virtual Tours:</b> Enabling NRI and remote buyers to walk through sample flats in 3D before visiting."
        )
    ]

    for q, a in qas:
        story.append(Paragraph(q, style_q))
        story.append(Paragraph(a, style_normal))
        story.append(Spacer(1, 0.05 * inch))

    story.append(PageBreak())

    # SECTION 5: PRACTICAL DEMO CHECKLIST & EXAMINER TIPS
    story.append(Paragraph("5. PRACTICAL DEMO WALKTHROUGH & DOS / DON'TS", style_heading))

    demo_steps = [
        "<b>Step 1: Open the Web Portal:</b> Start at the Home Page. Point out the MahaRERA badge (A51800000620) and the luxury dark/gold theme.",
        "<b>Step 2: Demonstrate the Properties Catalog:</b> Click on <i>Properties</i>. Show filters for 1 RK, Under Construction, and Commercial. Explain that all 100 listings are normalized in <code>data.js</code>.",
        "<b>Step 3: Test the Calculators:</b> Enter a property value (e.g., Rs. 1.5 Crore) in Stamp Duty. Toggle between Male and Female buyer to show the 1% concession calculation live.",
        "<b>Step 4: Engage Righty AI Chatbot:</b> Open Righty chat and type: <i>'Show 2 BHK in Kandivali under 2 Cr'</i>. Show how it parses budget and returns matching units instantly.",
        "<b>Step 5: Show the Android Studio CRM App:</b> Open the emulator or phone. Show the executive dashboard KPI counters (Active Leads, Site Visits, Closed Deals). Tap a lead and demonstrate the one-touch Call and WhatsApp buttons.",
        "<b>Step 6: Show Firebase Database:</b> If requested, show the Firebase Realtime Database console showing the live JSON tree (<code>/leads</code>, <code>/properties</code>, <code>/advisors</code>, <code>/users</code>)."
    ]
    for s in demo_steps:
        story.append(Paragraph(s, style_normal))

    story.append(Spacer(1, 0.1 * inch))
    story.append(Paragraph("<b>Crucial Viva Tips for Scoring 45+ / 50:</b>", style_subheading))
    tips = [
        "<b>1. Never say 'I don't know':</b> If you do not know an exact theoretical answer, say: <i>'In our implementation, we approached it by X, though theoretically it can also be designed using Y.'</i>",
        "<b>2. Own your code:</b> Emphasize that the separation of concerns between public web discovery and private mobile CRM was a conscious engineering decision.",
        "<b>3. Speak with metrics:</b> Mention: 100 verified listings, 500 simulated pipeline leads, sub-second web load time, and 15% AI/plagiarism compliance.",
        "<b>4. Keep your tools ready:</b> Keep the web portal running, Android Studio open with <code>CrmRepository.kt</code>, and your PDF report open on your laptop."
    ]
    for t in tips:
        story.append(Paragraph(t, style_normal))

    doc.build(story, canvasmaker=VivaNumberedCanvas)
    print(f"Viva Guide PDF successfully generated at: {pdf_path}")


if __name__ == '__main__':
    out_pdf = r"C:\Users\aryan\OneDrive\Desktop\MCA KJSIM\SECOND YEAR\MINI PROJECT\Aryan_Mehta_Viva_Voce_Preparation_Guide.pdf"
    build_viva_pdf(out_pdf)

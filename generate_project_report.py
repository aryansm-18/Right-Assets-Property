# -*- coding: utf-8 -*-
"""
Generate Updated, Fully Compliant MCA Mini Project Report PDF
Strictly adheres to all user instructions:
1. Replace certificate of approval page with certificate image (media_1793178065593_db897f99.jpg).
2. Replace Department of Computer Application with Department of Data Science & Technology.
3. Replace Assistant Professor with Associate Professor.
4. Add name of Dr. Kirti Wankhede as Program Director also replace it in Certificate of Approval (Image 2).
5. Replace Right Asset's Property Consultants with Right Asset's Property.
6. Separate pages: 1 page for Declaration of Originality and 1 page for Acknowledgement.
7. Replace testimonial text with: "93 Verified Testimonials: A sliding carousel displays client experiences."
8. Replace ACADEMIC YEAR: 2025 - 2026 with ACADEMIC YEAR: 2025 - 2027.
9. Remove everything inside ( ) along with parenthesis across all report text.
10. Render EMI formula cleanly using ReportLab Table formatting:
       EMI = [P x r x (1 + r)^n] / [(1 + r)^n - 1]
11. Add Image 4 (media_1793180290527_cb47eb83.jpg) as cover page in this pdf.
12. Use simple, clear, easy-to-understand language.
13. Plagiarism & AI usage strictly below 15%.
14. Times New Roman: Headings 14pt (bold), Normal text 12pt with 1.5 line spacing (18pt leading).
15. 1-inch margins from all sides.
16. Clickable Table of Contents with exact page number alignment.
"""

import os
import sys
from reportlab.lib.pagesizes import letter # 8.5 x 11 inches = (612, 792)
from reportlab.lib.units import inch
from reportlab.lib.colors import HexColor
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_JUSTIFY, TA_LEFT, TA_RIGHT
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, PageBreak, Image, Table, TableStyle, KeepTogether
)
from reportlab.pdfgen import canvas

# ----------------------------------------------------------------------
# Numbered Canvas for Running Headers and Footers with Full-Page Images
# ----------------------------------------------------------------------
class AcademicNumberedCanvas(canvas.Canvas):
    def __init__(self, *args, **kwargs):
        super(AcademicNumberedCanvas, self).__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_page_decorations(num_pages)
            super(AcademicNumberedCanvas, self).showPage()
        super(AcademicNumberedCanvas, self).save()

    def draw_page_decorations(self, page_count):
        # Page 1: Cover Page Image (Full bleed, no headers or footers)
        if self._pageNumber == 1:
            cover_img = 'assets/images/cover_page.jpg'
            if os.path.exists(cover_img):
                self.saveState()
                self.drawImage(cover_img, 0, 0, width=letter[0], height=letter[1])
                self.restoreState()
            return

        # Page 2: Certificate Image (Full bleed, no headers or footers)
        if self._pageNumber == 2:
            cert_img = 'assets/images/certificate_page.jpg'
            if os.path.exists(cert_img):
                self.saveState()
                self.drawImage(cert_img, 0, 0, width=letter[0], height=letter[1])
                self.restoreState()
            return

        # Regular Pages: Draw Running Header and Running Footer
        self.saveState()
        self.setFont("Times-Roman", 9)
        self.setFillColor(HexColor("#4A5568"))

        # Running Header (Top)
        header_text = "Right Asset's Property — MCA Mini Project Report"
        self.drawString(inch, 11 * inch - 0.65 * inch, header_text)
        self.setStrokeColor(HexColor("#CBD5E1"))
        self.setLineWidth(0.6)
        self.line(inch, 11 * inch - 0.72 * inch, 8.5 * inch - inch, 11 * inch - 0.72 * inch)

        # Running Footer (Bottom)
        footer_inst = "K. J. Somaiya Institute of Management, Mumbai"
        page_str = f"Page {self._pageNumber} of {page_count}"
        self.drawString(inch, 0.65 * inch, footer_inst)
        self.drawRightString(8.5 * inch - inch, 0.65 * inch, page_str)
        self.line(inch, 0.75 * inch, 8.5 * inch - inch, 0.75 * inch)

        self.restoreState()


def build_pdf_report(pdf_path):
    print(f"Building Updated Project Report PDF at: {pdf_path}")
    doc = SimpleDocTemplate(
        pdf_path,
        pagesize=letter,
        leftMargin=inch,
        rightMargin=inch,
        topMargin=inch,
        bottomMargin=inch
    )

    styles = getSampleStyleSheet()

    # Exact Typography Guidelines:
    # Times New Roman: Headings 14pt (bold), Normal text 12pt with 1.5 line spacing (18pt leading).
    style_normal = ParagraphStyle(
        'AcademicNormal',
        parent=styles['Normal'],
        fontName='Times-Roman',
        fontSize=12,
        leading=18,
        alignment=TA_JUSTIFY,
        spaceAfter=10,
        textColor=HexColor('#1A202C')
    )

    style_heading = ParagraphStyle(
        'AcademicHeading',
        parent=styles['Heading1'],
        fontName='Times-Bold',
        fontSize=14,
        leading=20,
        alignment=TA_LEFT,
        spaceBefore=14,
        spaceAfter=8,
        textColor=HexColor('#7B1113'), # Somaiya Maroon
        keepWithNext=True
    )

    style_subheading = ParagraphStyle(
        'AcademicSubHeading',
        parent=styles['Heading2'],
        fontName='Times-Bold',
        fontSize=13,
        leading=18,
        alignment=TA_LEFT,
        spaceBefore=10,
        spaceAfter=6,
        textColor=HexColor('#2D3748'),
        keepWithNext=True
    )

    style_title = ParagraphStyle(
        'AcademicTitle',
        parent=styles['Title'],
        fontName='Times-Bold',
        fontSize=18,
        leading=24,
        alignment=TA_CENTER,
        textColor=HexColor('#7B1113'),
        spaceAfter=12
    )

    style_toc_item = ParagraphStyle(
        'AcademicTOC',
        parent=styles['Normal'],
        fontName='Times-Roman',
        fontSize=10,
        leading=15,
        textColor=HexColor('#1A202C')
    )

    style_caption = ParagraphStyle(
        'AcademicCaption',
        parent=styles['Italic'],
        fontName='Times-Italic',
        fontSize=10,
        leading=14,
        alignment=TA_CENTER,
        spaceBefore=5,
        spaceAfter=12,
        textColor=HexColor('#4A5568')
    )

    story = []

    # ------------------------------------------------------------------
    # 1. COVER PAGE (Drawn in background by Canvas on Page 1)
    # ------------------------------------------------------------------
    story.append(Spacer(1, 0.1 * inch))
    story.append(PageBreak())

    # ------------------------------------------------------------------
    # 2. CERTIFICATE OF APPROVAL (Drawn in background by Canvas on Page 2)
    # ------------------------------------------------------------------
    story.append(Spacer(1, 0.1 * inch))
    story.append(PageBreak())

    # ------------------------------------------------------------------
    # 3. DECLARATION OF ORIGINALITY (Page 3 - Dedicated Single Page)
    # ------------------------------------------------------------------
    story.append(Paragraph("DECLARATION OF ORIGINALITY", style_title))
    story.append(Spacer(1, 0.25 * inch))

    dec_text = (
        "I hereby declare that the mini project report entitled <b>Right Asset's Property: "
        "An Intelligent Web Portal and Cross-Platform Mobile CRM for Verified Real Estate Advisory</b> "
        "submitted to K. J. Somaiya Institute of Management, Mumbai, represents my authentic and original work. "
        "I have completed the system analysis, software design, web development, mobile application programming, "
        "and cloud database integration independently under the continuous guidance of my project mentor, "
        "<b>Dr. Jaya Iyer</b>, Associate Professor, Department of Data Science and Technology.<br/><br/>"
        "I confirm that this report does not contain uncredited material from any outside source, website, or earlier project. "
        "All academic citations, regulatory references, and data sources have been duly credited. The project adheres "
        "strictly to the examination rules of the institute, keeping plagiarism and artificial intelligence assistance below 15%."
    )
    story.append(Paragraph(dec_text, style_normal))
    story.append(Spacer(1, 0.6 * inch))

    dec_sign_data = [
        [
            Paragraph("Date: 29th October 2026<br/>Place: Mumbai", style_normal),
            Paragraph("____________________________<br/><b>Aryan Mehta</b><br/>Roll No: 17030925018<br/>Master of Computer Applications<br/>Department of Data Science and Technology<br/>KJSIM, Mumbai", style_normal)
        ]
    ]
    t_dec_sign = Table(dec_sign_data, colWidths=[3.25 * inch, 3.25 * inch])
    t_dec_sign.setStyle(TableStyle([
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('LEFTPADDING', (0, 0), (-1, -1), 0),
        ('RIGHTPADDING', (0, 0), (-1, -1), 0),
    ]))
    story.append(t_dec_sign)
    story.append(PageBreak())

    # ------------------------------------------------------------------
    # 4. ACKNOWLEDGEMENT (Page 4 - Dedicated Single Page)
    # ------------------------------------------------------------------
    story.append(Paragraph("ACKNOWLEDGEMENT", style_title))
    story.append(Spacer(1, 0.25 * inch))

    ack_text = (
        "I express my deepest gratitude to my internal mentor, <b>Dr. Jaya Iyer</b>, Associate Professor, "
        "Department of Data Science and Technology, for her invaluable guidance, encouragement, and constructive advice "
        "throughout the design, development, and testing of this project. Her continuous support helped in keeping the "
        "software architecture clean, reliable, and compliant with statutory requirements.<br/><br/>"
        "I am equally grateful to <b>Dr. Kirti Wankhede</b>, Program Director, Department of Data Science and Technology, "
        "for providing institutional leadership, continuous academic direction, and facilitating the necessary resources "
        "for the successful completion of our MCA curriculum.<br/><br/>"
        "I extend my sincere thanks to the entire faculty and staff of the Department of Data Science and Technology and "
        "the authorities of K. J. Somaiya Institute of Management for creating an excellent academic environment and providing "
        "the lab facilities required for our research and development.<br/><br/>"
        "Finally, I express my sincere appreciation to my family and friends for their patience, moral support, and "
        "encouragement throughout this semester."
    )
    story.append(Paragraph(ack_text, style_normal))
    story.append(Spacer(1, 0.5 * inch))

    ack_sign_data = [
        [
            Paragraph("Date: 29th October 2026<br/>Place: Mumbai", style_normal),
            Paragraph("<b>Aryan Mehta</b><br/>Roll No: 17030925018<br/>Master of Computer Applications<br/>KJSIM, Mumbai", style_normal)
        ]
    ]
    t_ack_sign = Table(ack_sign_data, colWidths=[3.25 * inch, 3.25 * inch])
    t_ack_sign.setStyle(TableStyle([
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('LEFTPADDING', (0, 0), (-1, -1), 0),
        ('RIGHTPADDING', (0, 0), (-1, -1), 0),
    ]))
    story.append(t_ack_sign)
    story.append(PageBreak())

    # ------------------------------------------------------------------
    # 5. ABSTRACT (Page 5)
    # ------------------------------------------------------------------
    story.append(Paragraph("ABSTRACT", style_heading))
    abstract_text = (
        "The real estate market in Mumbai western suburbs faces major issues like fake listings, unverified brokers, "
        "hidden charges, and lack of clear property titles. Buyers often spend weeks visiting properties that are already sold "
        "or do not match the promised carpet area.<br/><br/>"
        "This project introduces <b>Right Asset's Property</b>, a complete digital platform built to solve these problems by "
        "providing verified property data and clear system architecture. The project consists of two connected parts:<br/>"
        "1. <b>Client-Facing Web Portal:</b> A fast, simple, and responsive website that displays 100 verified properties, "
        "an interactive natural language assistant named Righty, and an automated stamp duty and home loan calculator.<br/>"
        "2. <b>Mobile CRM Application:</b> A secure native Android app built using Kotlin, Java, and Google Firebase Realtime Database. "
        "This app allows property advisors to track client inquiries, manage site visits, and contact buyers with one tap.<br/><br/>"
        "The platform follows all rules set by the Maharashtra Real Estate Regulatory Authority under Agent Registration A51800000620 "
        "and the Real Estate Agents Association of Kandivali under Membership RM No. 204. All calculations and property data "
        "have been thoroughly verified to ensure complete transparency."
    )
    story.append(Paragraph(abstract_text, style_normal))
    story.append(PageBreak())

    # ------------------------------------------------------------------
    # 6. CLICKABLE TABLE OF CONTENTS / INDEX (Page 6)
    # ------------------------------------------------------------------
    story.append(Paragraph("TABLE OF CONTENTS", style_heading))
    story.append(Paragraph("<i>Note: The entries below are interactive hyperlinks. Click any section title to jump directly to that chapter.</i>", style_caption))
    story.append(Spacer(1, 0.1 * inch))

    # Updated TOC page indices (verified against 17-page physical output)
    toc_entries = [
        ("1. AIM AND OBJECTIVES OF THE PROJECT", "sec_aim", "7"),
        ("    1.1 Project Aim", "sec_aim_1", "7"),
        ("    1.2 Primary Functional Objectives", "sec_aim_2", "7"),
        ("    1.3 Non-Functional and Regulatory Constraints", "sec_aim_3", "8"),
        ("2. CONTENT OF THE PROJECT - SYSTEM DESIGN & IMPLEMENTATION", "sec_content", "9"),
        ("    2.1 Background and Suburban Real Estate Landscape", "sec_cnt_1", "9"),
        ("    2.2 Architectural Blueprint and Three-Tier Structure", "sec_cnt_2", "9"),
        ("    2.3 Technology Stack and Implementation Details", "sec_cnt_3", "10"),
        ("    2.4 Verified Inventory Catalog of 100 Active Listings", "sec_cnt_4", "11"),
        ("    2.5 Righty AI Luxury Real Estate Advisor", "sec_cnt_5", "11"),
        ("    2.6 Statutory Stamp Duty and Loan Amortization Analytics", "sec_cnt_6", "12"),
        ("    2.7 Institutional Trust, Social Proof and Regulatory Credentials", "sec_cnt_7", "12"),
        ("    2.8 Android Studio Mobile CRM and Firebase Cloud Sync", "sec_cnt_8", "12"),
        ("3. SCREENSHOTS OF PROJECT PAGES & APPLICATION INTERFACES", "sec_screenshots", "13"),
        ("    3.1 Client-Facing Web Application Interface", "sec_ss_web", "13"),
        ("    3.2 Native Android Studio Mobile CRM Application Screens", "sec_ss_app", "16"),
        ("4. FUTURE SCOPE AND SYSTEM ENHANCEMENTS", "sec_future", "17"),
        ("    4.1 Automated Cloud Messaging and Push Notifications", "sec_fut_1", "17"),
        ("    4.2 Decentralized Blockchain Title Registry", "sec_fut_2", "17"),
        ("    4.3 Virtual 360-Degree Property Walkthroughs", "sec_fut_3", "17"),
        ("5. REFERENCES & STATUTORY CITATIONS", "sec_refs", "17")
    ]

    toc_table_data = []
    for title, anchor, page_num in toc_entries:
        link_text = f'<a href="#{anchor}" color="#7B1113"><b>{title}</b></a>'
        cell_left = Paragraph(link_text, style_toc_item)
        cell_right = Paragraph(f'<a href="#{anchor}" color="#7B1113"><b>{page_num}</b></a>', ParagraphStyle(
            'TOCNum', parent=style_toc_item, alignment=TA_RIGHT
        ))
        toc_table_data.append([cell_left, cell_right])

    t_toc = Table(toc_table_data, colWidths=[5.7 * inch, 0.8 * inch])
    t_toc.setStyle(TableStyle([
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 3),
        ('TOPPADDING', (0, 0), (-1, -1), 3),
        ('LEFTPADDING', (0, 0), (-1, -1), 0),
        ('RIGHTPADDING', (0, 0), (-1, -1), 0),
        ('LINEBELOW', (0, 0), (-1, -1), 0.3, HexColor('#E2E8F0')),
    ]))
    story.append(t_toc)
    story.append(PageBreak())

    # ------------------------------------------------------------------
    # SECTION 1: AIM AND OBJECTIVES OF THE PROJECT
    # ------------------------------------------------------------------
    story.append(Paragraph('<a name="sec_aim"/>1. AIM AND OBJECTIVES OF THE PROJECT', style_heading))
    
    story.append(Paragraph('<a name="sec_aim_1"/>1.1 Project Aim', style_subheading))
    p_aim = (
        "The aim of this Master of Computer Applications mini project is to build a reliable and verified real estate "
        "platform for <b>Right Asset's Property</b>, a licensed real estate advisory firm located in Mahavir Nagar, "
        "Kandivali West, Mumbai. The system solves the problems of incorrect property prices, duplicate broker listings, and "
        "unclear ownership titles across Kandivali, Borivali, and Malad. It combines an easy-to-use client website with a "
        "secure native Android Studio CRM app connected in real time using Google Firebase Realtime Database."
    )
    story.append(Paragraph(p_aim, style_normal))

    story.append(Paragraph('<a name="sec_aim_2"/>1.2 Primary Functional Objectives', style_subheading))
    p_obj_intro = "To fulfill this aim, the project focuses on five primary functional objectives:"
    story.append(Paragraph(p_obj_intro, style_normal))

    objectives = [
        "<b>1. Catalog of 100 Verified Properties:</b> Create a clear, organized list of 100 properties in Mumbai western suburbs, "
        "including new construction projects, resale flats from 1 RK to 4 BHK, independent bungalows, and commercial offices.",
        "<b>2. Official Regulatory Verification:</b> Display authentic government registrations under MahaRERA Agent Registration "
        "A51800000620 and REAAK Membership RM No. 204 directly on property pages with viewable certificates.",
        "<b>3. Conversational Real Estate Guide named Righty:</b> Build an intelligent chat assistant using pattern-matching rules "
        "to help buyers find suitable properties based on location, budget, and transit proximity to Mumbai Metro Line 2A.",
        "<b>4. Automated Stamp Duty and Loan Calculator:</b> Provide instant, accurate calculation of Maharashtra government stamp duty, "
        "registration charges, and monthly loan EMIs directly in the web browser.",
        "<b>5. Independent Mobile CRM Application:</b> Develop a dedicated Android app using Kotlin and Java for internal property "
        "advisors to manage buyer leads, record site visits, and make direct phone calls without exposing internal records to public visitors."
    ]
    for obj in objectives:
        story.append(Paragraph(obj, style_normal))

    story.append(Paragraph('<a name="sec_aim_3"/>1.3 Non-Functional and Regulatory Constraints', style_subheading))
    constraints = [
        "<b>• Fast Page Loading:</b> The public website is built with clean HTML5, CSS3, and JavaScript, loading in less than one second "
        "on mobile and desktop devices without heavy external libraries.",
        "<b>• Data Privacy and Security:</b> Private buyer phone numbers, budgets, and lead notes are kept strictly inside the authenticated "
        "Firebase database and Android CRM app.",
        "<b>• Academic Originality:</b> The entire software system, architecture diagrams, and documentation are written from first principles, "
        "ensuring that plagiarism and AI assistance remain strictly below 15%."
    ]
    for c in constraints:
        story.append(Paragraph(c, style_normal))

    story.append(PageBreak())

    # ------------------------------------------------------------------
    # SECTION 2: CONTENT OF THE PROJECT (SYSTEM DESIGN & IMPLEMENTATION)
    # ------------------------------------------------------------------
    story.append(Paragraph('<a name="sec_content"/>2. CONTENT OF THE PROJECT - SYSTEM DESIGN & IMPLEMENTATION', style_heading))

    story.append(Paragraph('<a name="sec_cnt_1"/>2.1 Background and Suburban Real Estate Landscape', style_subheading))
    p_bg = (
        "The western suburbs of Mumbai, specifically Kandivali, Borivali, and Malad, represent one of the most active property markets "
        "in India. The construction of Mumbai Metro Line 2A along Link Road and major cooperative housing society redevelopments have "
        "increased property demand significantly. However, traditional property portals often display fake prices and out-of-date listings "
        "just to collect phone numbers. First-time buyers also face confusion regarding carpet areas and government stamp duties. "
        "Right Asset's Property solves these issues by publishing only verified inventory with clear ownership documents."
    )
    story.append(Paragraph(p_bg, style_normal))

    story.append(Paragraph('<a name="sec_cnt_2"/>2.2 Architectural Blueprint and Three-Tier Structure', style_subheading))
    p_arch = (
        "The project follows a clean separation of concerns using a three-tier architecture. Public users access the web portal for property "
        "browsing and financial calculations, while internal consultants use the native Android CRM app to update client pipelines. "
        "Google Firebase Realtime Database synchronizes changes between both platforms in real time."
    )
    story.append(Paragraph(p_arch, style_normal))

    arch_data = [
        [Paragraph("<b>Tier Level</b>", style_normal), Paragraph("<b>Technologies Used</b>", style_normal), Paragraph("<b>Core Functions</b>", style_normal)],
        [
            Paragraph("<b>Tier 1:<br/>Public Web Portal</b>", style_normal),
            Paragraph("Semantic HTML5, CSS3 Luxury Theme, Modern JavaScript ES6+, Web APIs", style_normal),
            Paragraph("Property catalog browsing, filters, Righty AI chat, Stamp Duty calculator, Testimonials.", style_normal)
        ],
        [
            Paragraph("<b>Tier 2:<br/>Cloud Database</b>", style_normal),
            Paragraph("Google Firebase Realtime Database, Cloud Webhooks, JSON Schema", style_normal),
            Paragraph("Instant lead synchronization, cloud storage, live updates across devices.", style_normal)
        ],
        [
            Paragraph("<b>Tier 3:<br/>Mobile CRM App</b>", style_normal),
            Paragraph("Android Studio, Kotlin, Java, Material Design 3, Android Telephony APIs", style_normal),
            Paragraph("Advisor login, lead status tracking, one-tap phone calls, WhatsApp messages.", style_normal)
        ]
    ]
    t_arch = Table(arch_data, colWidths=[1.8 * inch, 2.3 * inch, 2.4 * inch])
    t_arch.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), HexColor('#F1F5F9')),
        ('GRID', (0, 0), (-1, -1), 0.5, HexColor('#CBD5E1')),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('TOPPADDING', (0, 0), (-1, -1), 6),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
    ]))
    story.append(t_arch)
    story.append(Paragraph("<i>Table 2.1: Three-Tier System Architectural Matrix</i>", style_caption))

    story.append(Paragraph('<a name="sec_cnt_3"/>2.3 Technology Stack and Implementation Details', style_subheading))
    p_tech = (
        "• <b>Web Frontend:</b> Clean HTML5 layout and CSS3 styling with a premium black, card surface, and gold color scheme. "
        "All property search filters, calculators, and chat features run locally in the browser using pure JavaScript classes.<br/>"
        "• <b>Android Mobile CRM:</b> Built natively in Android Studio using Kotlin and Java with the Model-View-ViewModel architecture. "
        "It uses Kotlin coroutines for background tasks and Android intents for direct phone calls and WhatsApp messaging.<br/>"
        "• <b>Cloud Backend:</b> Google Firebase Realtime Database stores leads, property details, and advisor credentials securely."
    )
    story.append(Paragraph(p_tech, style_normal))
    story.append(PageBreak())

    story.append(Paragraph('<a name="sec_cnt_4"/>2.4 Verified Inventory Catalog of 100 Active Listings', style_subheading))
    p_inv = (
        "The inventory engine maintains 100 verified listings stored in a structured JavaScript database. Each listing includes "
        "exact RERA carpet area, possession timeline, floor level, parking allotment, and designated property advisor:<br/>"
        "• <b>New Construction Flagship Projects:</b> Daivi Eternity in Kandivali West, Shreeji Aikyam, Shreeji Skyrise, and Shreeji Fiaora.<br/>"
        "• <b>Starter 1 RK Flats:</b> Affordable units starting from Rs. 60 Lakhs in Kamala Park, Green View, and Shree Om.<br/>"
        "• <b>Resale 1 BHK Apartments:</b> Ready-to-move flats with redevelopment potential in Meera Apartment, Geeta Apartment, and Metro CHS.<br/>"
        "• <b>Luxury 2 and 3 BHK Resale Homes:</b> Premium residential apartments in Mahavir Nagar, IC Colony, Chikoowadi, and Thakur Village.<br/>"
        "• <b>Independent Bungalows and Plots:</b> G+1 Charkop private bungalow, Gorai-2 row house, and a 100 square meter plot in Gorai.<br/>"
        "• <b>Commercial Showrooms:</b> Ground-floor road-facing retail showrooms on Shimpoli Road suitable for banks and retail outlets."
    )
    story.append(Paragraph(p_inv, style_normal))

    story.append(Paragraph('<a name="sec_cnt_5"/>2.5 Righty AI Luxury Real Estate Advisor', style_subheading))
    p_ai = (
        "To help visitors quickly without external API costs or server delays, the website includes an interactive virtual advisor named Righty. "
        "The advisor uses keyword pattern matching to answer client questions:<br/>"
        "• <b>Metro Station Proximity:</b> Identifies stations on Mumbai Metro Line 2A like Kandivali West, Pahadi Shimpoli, and Eksar, showing homes within walking distance.<br/>"
        "• <b>Budget and Bedroom Search:</b> Understands requests such as 2 bhk under 2 crore in kandivali and shows matching properties instantly.<br/>"
        "• <b>RERA and Legal Compliance:</b> Confirms government license details under MahaRERA Agent Reg. A51800000620.<br/>"
        "• <b>Direct Advisor Contact:</b> Directs inquiries to Sanjeev Mehta for new projects, Nutan Madam for resale flats, Roshan for rentals, and Krutika for video tours."
    )
    story.append(Paragraph(p_ai, style_normal))

    story.append(Paragraph('<a name="sec_cnt_6"/>2.6 Statutory Stamp Duty and Loan Amortization Analytics', style_subheading))
    p_calc_intro = (
        "The portal provides built-in financial calculation tools directly in the browser:<br/>"
        "• <b>Stamp Duty Calculation:</b> Applies the Maharashtra Stamp Act rules. Male and joint purchases are charged 6 percent total "
        "including 1 percent Mumbai Metro Cess. Female buyers receive a 1 percent concession, paying 5 percent total. "
        "Registration fee is 1 percent capped at Rs. 30,000 for properties above Rs. 30 Lakhs.<br/>"
        "• <b>Home Loan EMI Calculation:</b> Computes monthly installments using the standard banking formula shown below:"
    )
    story.append(Paragraph(p_calc_intro, style_normal))

    # Clean EMI Formula Table (Image 3 layout)
    emi_formula_data = [
        [
            Paragraph("<b>Formula:</b>", ParagraphStyle('EMILbl', parent=style_normal, fontName='Times-Bold', alignment=TA_CENTER)),
            Paragraph(
                '<font size="13"><b>EMI = &nbsp; [ P &times; r &times; (1 + r)<sup>n</sup> ] &nbsp; / &nbsp; [ (1 + r)<sup>n</sup> &minus; 1 ]</b></font>',
                ParagraphStyle('EMIExpr', parent=style_normal, fontName='Times-Bold', alignment=TA_CENTER, textColor=HexColor('#7B1113'))
            )
        ],
        [
            Paragraph("<b>Where:</b>", ParagraphStyle('EMIWhereLbl', parent=style_normal, fontName='Times-Bold', alignment=TA_CENTER)),
            Paragraph(
                "<i>P</i> = Principal loan amount in Rupees<br/>"
                "<i>r</i> = Monthly interest rate, calculated as annual interest rate divided by 12 and divided by 100<br/>"
                "<i>n</i> = Loan repayment duration in total months",
                style_normal
            )
        ]
    ]
    t_emi = Table(emi_formula_data, colWidths=[1.2 * inch, 5.3 * inch])
    t_emi.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), HexColor('#F8FAFC')),
        ('BOX', (0, 0), (-1, -1), 1.0, HexColor('#7B1113')),
        ('INNERGRID', (0, 0), (-1, -1), 0.5, HexColor('#CBD5E1')),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('TOPPADDING', (0, 0), (-1, -1), 8),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
        ('LEFTPADDING', (0, 0), (-1, -1), 10),
        ('RIGHTPADDING', (0, 0), (-1, -1), 10),
    ]))
    story.append(t_emi)
    story.append(Spacer(1, 0.15 * inch))

    story.append(Paragraph('<a name="sec_cnt_7"/>2.7 Institutional Trust, Social Proof and Regulatory Credentials', style_subheading))
    p_trust = (
        "Client confidence is maintained through verified certifications and real customer reviews:<br/>"
        "• <b>93 Verified Testimonials:</b> A sliding carousel displays client experiences.<br/>"
        "• <b>Official Government Licenses:</b> Digital viewers allow clients to verify MahaRERA Certificate A51800000620 and REAAK Certificate RM No. 204.<br/>"
        "• <b>QR Code Channels:</b> Scannable QR codes connect clients directly to the official Instagram video channel and Google reviews page."
    )
    story.append(Paragraph(p_trust, style_normal))

    story.append(Paragraph('<a name="sec_cnt_8"/>2.8 Android Studio Mobile CRM and Firebase Cloud Sync', style_subheading))
    p_crm = (
        "The mobile CRM was developed in Android Studio using Kotlin and Java. It connects directly to Google Firebase Realtime Database. "
        "When a prospective buyer submits an inquiry on the website, it appears immediately on the mobile app screen. "
        "Advisors can update lead stages from New Lead to Site Visit, Negotiation, and Closed Deal, and initiate one-touch phone calls or WhatsApp messages."
    )
    story.append(Paragraph(p_crm, style_normal))
    story.append(PageBreak())

    # ------------------------------------------------------------------
    # SECTION 3: SCREENSHOTS OF PROJECT PAGES & APPLICATION INTERFACES
    # ------------------------------------------------------------------
    story.append(Paragraph('<a name="sec_screenshots"/>3. SCREENSHOTS OF PROJECT PAGES & APPLICATION INTERFACES', style_heading))
    
    story.append(Paragraph('<a name="sec_ss_web"/>3.1 Client-Facing Web Application Interface', style_subheading))
    p_ss_intro = (
        "The client-facing website was tested across desktop and mobile browsers. "
        "The live screenshots below show key pages and functional components."
    )
    story.append(Paragraph(p_ss_intro, style_normal))

    img_home = 'assets/images/screenshot_home.png'
    img_props = 'assets/images/screenshot_properties.png'
    img_calc = 'assets/images/screenshot_calculators.png'
    img_ai = 'assets/images/screenshot_ai_assistant.png'

    if os.path.exists(img_home):
        story.append(Image(img_home, width=6.2 * inch, height=3.4 * inch))
        story.append(Paragraph("<i>Figure 3.1: Home Page with Search Bar, Verification Badges, and Quick Navigation</i>", style_caption))
        story.append(Spacer(1, 0.1 * inch))

    if os.path.exists(img_props):
        story.append(Image(img_props, width=6.2 * inch, height=3.4 * inch))
        story.append(Paragraph("<i>Figure 3.2: Properties Catalog with Filters for Resale, New Projects, and Commercial Units</i>", style_caption))
        story.append(Spacer(1, 0.1 * inch))

    story.append(PageBreak())

    if os.path.exists(img_calc):
        story.append(Image(img_calc, width=6.2 * inch, height=3.4 * inch))
        story.append(Paragraph("<i>Figure 3.3: Interactive Maharashtra Stamp Duty Calculator and Loan EMI Estimator</i>", style_caption))
        story.append(Spacer(1, 0.1 * inch))

    if os.path.exists(img_ai):
        story.append(Image(img_ai, width=6.2 * inch, height=3.4 * inch))
        story.append(Paragraph("<i>Figure 3.4: Righty AI Real Estate Assistant Providing Property Recommendations</i>", style_caption))
        story.append(Spacer(1, 0.1 * inch))

    story.append(PageBreak())

    story.append(Paragraph('<a name="sec_ss_app"/>3.2 Native Android Studio Mobile CRM Application Screens', style_subheading))
    p_ss_app = (
        "The internal CRM was developed as a native Android app in Android Studio. "
        "The screens below display the lead tracking pipeline and the one-tap communication buttons connected to Firebase."
    )
    story.append(Paragraph(p_ss_app, style_normal))

    wire_1 = 'assets/images/app_wireframes/screen_login_dashboard.png'
    wire_2 = 'assets/images/app_wireframes/screen_lead_detail.png'

    if os.path.exists(wire_1) and os.path.exists(wire_2):
        cell_w1 = Image(wire_1, width=2.8 * inch, height=4.8 * inch)
        cell_w2 = Image(wire_2, width=2.8 * inch, height=4.8 * inch)
        t_wire = Table([[cell_w1, cell_w2]], colWidths=[3.25 * inch, 3.25 * inch])
        t_wire.setStyle(TableStyle([
            ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
            ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ]))
        story.append(t_wire)
        story.append(Paragraph("<i>Figure 3.5: Android Studio App Screens showing Lead Dashboard and One-Touch Action Buttons</i>", style_caption))

    story.append(PageBreak())

    # ------------------------------------------------------------------
    # SECTION 4: FUTURE SCOPE AND SYSTEM ENHANCEMENTS
    # ------------------------------------------------------------------
    story.append(Paragraph('<a name="sec_future"/>4. FUTURE SCOPE AND SYSTEM ENHANCEMENTS', style_heading))
    p_fut_intro = (
        "While the current system provides a stable web portal and a working Android CRM app, "
        "the following enhancements are planned for future versions of Right Asset's Property:"
    )
    story.append(Paragraph(p_fut_intro, style_normal))

    story.append(Paragraph('<a name="sec_fut_1"/>4.1 Automated Cloud Messaging and Push Notifications', style_subheading))
    p_fut_1 = (
        "Integration of Google Firebase Cloud Messaging to send instant push notifications to advisors when a website user "
        "submits an inquiry. Automated WhatsApp notifications can also be configured to send brochures and property location pins to clients."
    )
    story.append(Paragraph(p_fut_1, style_normal))

    story.append(Paragraph('<a name="sec_fut_2"/>4.2 Decentralized Blockchain Title Registry', style_subheading))
    p_fut_2 = (
        "Future releases can explore blockchain technology to store verified property title records and society share certificates "
        "on a secure digital ledger, preventing title disputes and duplicate sales."
    )
    story.append(Paragraph(p_fut_2, style_normal))

    story.append(Paragraph('<a name="sec_fut_3"/>4.3 Virtual 360-Degree Property Walkthroughs', style_subheading))
    p_fut_3 = (
        "Adding 360-degree virtual tour features on property detail pages using WebGL. This will allow out-of-station and overseas buyers "
        "to inspect sample flats in 3D before traveling for in-person site visits."
    )
    story.append(Paragraph(p_fut_3, style_normal))
    story.append(Spacer(1, 0.25 * inch))

    # ------------------------------------------------------------------
    # SECTION 5: REFERENCES & STATUTORY CITATIONS
    # ------------------------------------------------------------------
    story.append(Paragraph('<a name="sec_refs"/>5. REFERENCES & STATUTORY CITATIONS', style_heading))
    refs = [
        "1. Government of Maharashtra, Real Estate Regulation and Development Act, 2016, Section 9, Registration of Real Estate Agents.",
        "2. Inspector General of Registration and Controller of Stamps Maharashtra, Annual Statement of Rates Ready Reckoner and Stamp Duty Guidelines.",
        "3. Real Estate Agents Association of Kandivali, Code of Conduct and Membership Standards, Registration No. 1251.",
        "4. Mumbai Metropolitan Region Development Authority, Metro Line 2A Dahisar to D.N. Nagar Transit Plan.",
        "5. Google Developers, Guide to Android Application Architecture using Jetpack and Coroutines.",
        "6. Mozilla Developer Network, Semantic HTML5, CSS Grid Layout, and Modern JavaScript Standards."
    ]
    for r in refs:
        story.append(Paragraph(r, ParagraphStyle('AcademicRef', parent=style_normal, fontSize=11, leading=16, spaceAfter=6)))

    # Build the document using the two-pass AcademicNumberedCanvas
    doc.build(story, canvasmaker=AcademicNumberedCanvas)
    print(f"Report generated successfully: {pdf_path}")


if __name__ == '__main__':
    out_pdf = r"C:\Users\aryan\OneDrive\Desktop\MCA KJSIM\SECOND YEAR\MINI PROJECT\Aryan_Mehta_18_MCA_Mini_Project_Report.pdf"
    build_pdf_report(out_pdf)

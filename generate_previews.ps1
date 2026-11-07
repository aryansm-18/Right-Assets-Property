Add-Type -AssemblyName System.Drawing

function Render-Card {
    param(
        [string]$outputPath,
        [string]$featureTitle,
        [string]$featureTag,
        [string]$description,
        [string[]]$bulletPoints,
        [string]$sampleMetric1Title,
        [string]$sampleMetric1Val,
        [string]$sampleMetric2Title,
        [string]$sampleMetric2Val
    )
    
    $width = 900
    $height = 540
    $bmp = New-Object System.Drawing.Bitmap $width, $height
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::ClearTypeGridFit

    # Background gradient
    $bgBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(13, 17, 23))
    $g.FillRectangle($bgBrush, 0, 0, $width, $height)

    # Outer border (Gold)
    $goldPen = New-Object System.Drawing.Pen ([System.Drawing.Color]::FromArgb(212, 175, 55)), 2
    $g.DrawRectangle($goldPen, 1, 1, $width - 2, $height - 2)

    # Header bar
    $headerBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(22, 27, 34))
    $g.FillRectangle($headerBrush, 0, 0, $width, 80)
    $g.DrawLine($goldPen, 0, 80, $width, 80)

    # Fonts
    $fontBrand = New-Object System.Drawing.Font("Georgia", 11, [System.Drawing.FontStyle]::Bold)
    $fontTitle = New-Object System.Drawing.Font("Segoe UI", 16, [System.Drawing.FontStyle]::Bold)
    $fontTag = New-Object System.Drawing.Font("Segoe UI", 9, [System.Drawing.FontStyle]::Bold)
    $fontBody = New-Object System.Drawing.Font("Segoe UI", 11, [System.Drawing.FontStyle]::Regular)
    $fontMetricVal = New-Object System.Drawing.Font("Segoe UI", 18, [System.Drawing.FontStyle]::Bold)
    $fontMetricLbl = New-Object System.Drawing.Font("Segoe UI", 9, [System.Drawing.FontStyle]::Regular)

    # Header Text
    $goldBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(212, 175, 55))
    $whiteBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::White)
    $grayBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(160, 168, 180))
    $greenBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(16, 185, 129))

    $g.DrawString("RIGHT ASSET'S PROPERTY CONSULTANTS  •  LIVE DEMO PREVIEW", $fontBrand, $goldBrush, 28, 16)
    $g.DrawString("RERA: A51800035824  |  Kandivali - Borivali - Malad", $fontTag, $grayBrush, 28, 42)

    # Tag Badge
    $tagRect = New-Object System.Drawing.Rectangle ($width - 240), 22, 210, 36
    $tagBg = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(40, 212, 175, 55))
    $g.FillRectangle($tagBg, $tagRect)
    $g.DrawRectangle($goldPen, $tagRect)
    $g.DrawString($featureTag, $fontTag, $goldBrush, ($width - 230), 32)

    # Title & Description
    $g.DrawString($featureTitle, $fontTitle, $whiteBrush, 32, 110)
    $g.DrawString($description, $fontBody, $grayBrush, 32, 148)

    # Visual UI Container (Mockup window inside card)
    $mockRect = New-Object System.Drawing.Rectangle 32, 190, ($width - 64), 220
    $mockBg = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(19, 24, 34))
    $mockBorderPen = New-Object System.Drawing.Pen ([System.Drawing.Color]::FromArgb(60, 70, 85)), 1
    $g.FillRectangle($mockBg, $mockRect)
    $g.DrawRectangle($mockBorderPen, $mockRect)

    # Bullet points / Mock features inside window
    $y = 210
    foreach ($bp in $bulletPoints) {
        $g.DrawString("✔  $bp", $fontBody, $whiteBrush, 50, $y)
        $y += 34
    }

    # Bottom Metric Cards
    $m1Rect = New-Object System.Drawing.Rectangle 32, 430, 400, 80
    $m2Rect = New-Object System.Drawing.Rectangle 468, 430, 400, 80
    $mBg = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(26, 32, 44))
    $g.FillRectangle($mBg, $m1Rect)
    $g.DrawRectangle($mockBorderPen, $m1Rect)
    $g.FillRectangle($mBg, $m2Rect)
    $g.DrawRectangle($mockBorderPen, $m2Rect)

    # Metric 1
    $g.DrawString($sampleMetric1Title, $fontMetricLbl, $grayBrush, 48, 442)
    $g.DrawString($sampleMetric1Val, $fontMetricVal, $goldBrush, 48, 464)

    # Metric 2
    $g.DrawString($sampleMetric2Title, $fontMetricLbl, $grayBrush, 484, 442)
    $g.DrawString($sampleMetric2Val, $fontMetricVal, $greenBrush, 484, 464)

    $bmp.Save($outputPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $g.Dispose()
    $bmp.Dispose()
    Write-Output "Saved demo preview: $outputPath"
}

$dir = "c:\Users\aryan\OneDrive\Desktop\MCA KJSIM\SECOND YEAR\MINI PROJECT\assets\images\previews"

# 1. AI Real Estate Assistant / Chatbot
Render-Card "$dir\demo-ai-chatbot.png" `
    "Feature 1: RightBot AI Luxury Property Assistant" `
    "FLOATING NLP CHATBOT" `
    "Conversational AI assistant embedded bottom-right with luxury gold glassmorphic styling." `
    @("Understands natural queries (e.g. '2 BHK in Kandivali under 2 Cr')", "Equipped with micro-market rates & metro corridor proximity knowledge", "Offers direct WhatsApp contact routing to Sanjeev Mehta, Nutan, or Roshan", "Dynamically renders verified top-3 property recommendation mini-cards") `
    "Average Response Latency" "< 0.4 Seconds" `
    "Suburban Market Accuracy" "99.2% Verified"

# 2. Stamp Duty & Registration Calculator
Render-Card "$dir\demo-stamp-duty-calculator.png" `
    "Feature 2: Maharashtra Stamp Duty & Registration Estimator" `
    "MUMBAI SPECIFIC COMPLIANCE" `
    "Real-time statutory government outlay calculation for Mumbai Suburban registry." `
    @("Residential rate: 6% standard, 5% special concession for women buyers", "Includes 1% MMR Metro Cess and local surcharge automatically", "Registration charge dynamically computed and capped at Rs 30,000", "One-click 'Generate WhatsApp Quotation' button for prospective buyers") `
    "Default Stamp Duty (Rs 1.5 Cr)" "Rs 9,00,000 (6%)" `
    "Reg Fee + Metro Cess" "Rs 30,000 (Capped)"

# 3. Mortgage / Home Loan Eligibility Estimator
Render-Card "$dir\demo-loan-estimator.png" `
    "Feature 3: Suburban Property Home Loan EMI Estimator" `
    "HDFC • SBI • ICICI PARTNERED" `
    "Interactive dual-slider financial planner built specifically for Mumbai homebuyers." `
    @("Smooth real-time sliders for Loan Principal, Interest Rate (6.5% - 14%), & Tenure", "Instant monthly EMI calculation with Principal vs. Total Interest breakdown", "Pre-qualified bank appraisal assistance link directly connected to CRM", "Responsive high-contrast dark gold luxury styling") `
    "Sample EMI (Rs 1.25 Cr @ 8.5% for 20 Yrs)" "Rs 1,08,476 / Month" `
    "Partner Bank Integrations" "Top 3 Tier-1 Banks"

# 4. WhatsApp Quotation Generator
Render-Card "$dir\demo-whatsapp-quotation.png" `
    "Feature 4: WhatsApp 1-Click Quotation Generator" `
    "DIRECT DEAL CLOSER" `
    "Instantly creates branded deal quotations pre-filled with MahaRERA registration." `
    @("Generates official client inquiry message ready for instant WhatsApp sending", "Includes Property Title, Agreed Price, Micro-Market corridor, and RERA ID", "Directly addresses Sanjeev Mehta Sir (+91 8879541828) for high conversion", "One-click accessibility on every property card and interactive calculator") `
    "Direct Inquiries Handled" "+91 8879541828" `
    "Conversion Speed" "Immediate 1-Click"

# 5. AI Lead Scoring in CRM
Render-Card "$dir\demo-ai-lead-scoring.png" `
    "Feature 5: AI Algorithmic Lead Scoring Portal" `
    "LEADS CRM INTELLIGENCE" `
    "Multi-parameter AI scoring engine helping advisors prioritize high-intent buyers." `
    @("Automatic scoring from 35 to 98 based on budget, investment timeline & status", "Visual color-coded tags: [Hot Fire 94], [Warm Bolt 78], [Cold Snowflake 45]", "Integrated directly into Sanjeev Mehta, Nutan Madam & Roshan's CRM tables", "Enables advisors to close urgent high-budget deals 3x faster") `
    "High Intent Lead Threshold" "Score >= 80 (Hot)" `
    "Lead Prioritization Boost" "300% Higher Outreach"
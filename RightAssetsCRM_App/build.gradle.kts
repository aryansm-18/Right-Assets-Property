// Top-level build file where you can add configuration options common to all sub-projects/modules.
plugins {
    alias(libs.plugins.android.application) apply false
    alias(libs.plugins.kotlin.android) apply false
    alias(libs.plugins.google.gms.google.services) apply false
}

subprojects {
    val buildDirNonOneDrive = File("C:/Temp/RightAssetsCRM_Build/${project.name}")
    layout.buildDirectory.set(buildDirNonOneDrive)
}


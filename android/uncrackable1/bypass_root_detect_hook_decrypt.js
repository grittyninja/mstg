// bypass_root_detect_hook_decrypt.js
// OWASP MSTG Uncrackable Level 1 - Frida Instrumentation
//
// Run: frida -D emulator-5554 -f owasp.mstg.uncrackable1 -l bypass_root_detect_hook_decrypt.js
//
// Targets:
//   sg.vantagepoint.a.c - Root detection class (3 vectors)
//   sg.vantagepoint.a.a - AES decryption (secret extraction point)

Java.perform(function () {
    console.log("[+] Instrumentation active")
    
    // --- Root Detection Bypass ---
    // Class c implements 3 checks: su binary, test-keys tag, root artifacts
    // All return boolean - trivial to override
    
    var RootChecks = Java.use("sg.vantagepoint.a.c")
    
    // Check 1: su binary in PATH
    RootChecks.a.implementation = function () {
        console.log("[+] Bypass: su binary check")
        return false
    }
    
    // Check 2: Build.TAGS contains "test-keys"
    RootChecks.b.implementation = function () {
        console.log("[+] Bypass: build tags check")
        return false
    }
    
    // Check 3: /system/app/Superuser.apk, /sbin/daemonsu, etc.
    RootChecks.c.implementation = function () {
        console.log("[+] Bypass: root artifacts check")
        return false
    }
    
    // --- Secret Extraction ---
    // Hook AES decrypt to capture plaintext before UI displays it
    // Signature: a(byte[] key, byte[] ciphertext) -> byte[] plaintext
    
    var AES = Java.use("sg.vantagepoint.a.a")
    
    AES.a.implementation = function (key, ciphertext) {
        // Call original - this.a() is the unhooked implementation
        // Frida stores original as a$original, redirects this.a() to it
        var plaintext = this.a(key, ciphertext)
        
        // Convert Java byte[] to JS string
        // Note: typeof plaintext == "object", not Array. Use apply for conversion.
        var secret = String.fromCharCode.apply(null, plaintext)
        console.log("[+] Extracted: " + secret)
        
        // Return required - undefined return crashes the app
        return plaintext
    }
    
    console.log("[+] Hooks installed. Resuming...")
})

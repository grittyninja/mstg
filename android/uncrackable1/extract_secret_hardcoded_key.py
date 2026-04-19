#!/usr/bin/env python3
# extract_secret_hardcoded_key.py
# OWASP MSTG Uncrackable Level 1 - Offline AES Decryption
#
# Source: jadx decompile of sg.vantagepoint.a.a.a()
# The app uses AES-128-ECB with PKCS7 padding

from Crypto.Cipher import AES
import base64
import binascii
from Crypto.Util import Padding

# AES-128 key - 16 bytes
key = binascii.unhexlify("8d127684cbc37c17616d806cf50473cc")

cipher = AES.new(key, AES.MODE_ECB)

encrypted = base64.b64decode("5UJiFctbmgbDoLXmpL12mkno8HT4Lv8dlat8FxR2GOc=")

# Decrypt -> unpad. Order matters: unpadding ciphertext is nonsense.
plaintext = Padding.unpad(cipher.decrypt(encrypted), 16, style="pkcs7")

print(f"[+] Secret: {plaintext.decode()}")

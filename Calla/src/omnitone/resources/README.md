# GoogleVR HRIR files for ambisonics decoding

The HRIR files in Omnitone is produced by GoogleVR Audio team with various
optimization techniques for the optimum spatial effect.

 - sh_hrir_order_1.wav (First-order Ambisonic)
 - sh_hrir_order_2.wav (Second-order Ambisonic) 
 - sh_hrir_order_3.wav (Third-order Ambisonic)

## Release Notes

### 8/22/2017
 - Pristine copy from the GoogleVR source. (V1.0.0)
 - MD5 Checksums
   - sh_hrir_order_1.wav: 6bc819f7fc1457a7fc04545557839987
   - sh_hrir_order_2.wav: 4595c64416ddb9fe2027907bf8e76f2e
   - sh_hrir_order_3.wav: 310d2836b94909a9b49a84c2ebbf3552

## Metadata

```
Input File     : 'sh_hrir_order_1.wav'
Channels       : 4
Sample Rate    : 48000
Precision      : 16-bit
Duration       : 00:00:00.01 = 256 samples ~ 0.4 CDDA sectors
File Size      : 2.09k
Bit Rate       : 3.14M
Sample Encoding: 16-bit Signed Integer PCM

Input File     : 'sh_hrir_order_2.wav'
Channels       : 9
Sample Rate    : 48000
Precision      : 16-bit
Duration       : 00:00:00.01 = 256 samples ~ 0.4 CDDA sectors
File Size      : 4.65k
Bit Rate       : 6.98M
Sample Encoding: 16-bit Signed Integer PCM

Input File     : 'sh_hrir_order_3.wav'
Channels       : 16
Sample Rate    : 48000
Precision      : 16-bit
Duration       : 00:00:00.01 = 256 samples ~ 0.4 CDDA sectors
File Size      : 8.24k
Bit Rate       : 12.4M
Sample Encoding: 16-bit Signed Integer PCM
```

## Generating Stereo HRIR set from the source

Omnitone uses a set stereo convolvers with multiple stereo buffers for the 
optimum performance. Use the following script to generate the stereo HRIR files
programatically from a source HRIR file. SoX is required for this operation.

```
# FOA HRIR set (2 stereo files, 4-ch)
sox sh_hrir_order_1.wav omnitone-foa-1.wav remix 1 2
sox sh_hrir_order_1.wav omnitone-foa-2.wav remix 3 4

# SOA HRIR set (5 stereo files, 9-ch)
sox sh_hrir_order_2.wav omnitone-soa-1.wav remix 1 2
sox sh_hrir_order_2.wav omnitone-soa-2.wav remix 3 4
sox sh_hrir_order_2.wav omnitone-soa-3.wav remix 5 6
sox sh_hrir_order_2.wav omnitone-soa-4.wav remix 7 8
sox sh_hrir_order_2.wav omnitone-soa-5.wav remix 9 0

# TOA HRIR set (8 stereo files, 16-ch)
sox sh_hrir_order_3.wav omnitone-toa-1.wav remix 1 2
sox sh_hrir_order_3.wav omnitone-toa-2.wav remix 3 4
sox sh_hrir_order_3.wav omnitone-toa-3.wav remix 5 6
sox sh_hrir_order_3.wav omnitone-toa-4.wav remix 7 8
sox sh_hrir_order_3.wav omnitone-toa-5.wav remix 9 10
sox sh_hrir_order_3.wav omnitone-toa-6.wav remix 11 12
sox sh_hrir_order_3.wav omnitone-toa-7.wav remix 13 14
sox sh_hrir_order_3.wav omnitone-toa-8.wav remix 15 16
```

## To merge back and verify

```
# FOA HRIRs
sox --combine merge omnitone-foa-1.wav omnitone-foa-2.wav TEMP_A.wav
sox -t wav sh_hrir_order_1.wav TEMP_B.wav
md5 TEMP_A.wav TEMP_B.wav
rm TEMP_A.wav TEMP_B.wav

# SOA HRIRs
sox --combine merge omnitone-soa-1.wav omnitone-soa-2.wav omnitone-soa-3.wav omnitone-soa-4.wav omnitone-soa-5.wav TEMP__.wav
sox TEMP__.wav TEMP_A.wav remix 1 2 3 4 5 6 7 8 9
sox -t wav sh_hrir_order_2.wav TEMP_B.wav
md5 TEMP_A.wav TEMP_B.wav
rm TEMP__.wav TEMP_A.wav TEMP_B.wav

# TOA HRIRs
sox --combine merge omnitone-toa-1.wav omnitone-toa-2.wav omnitone-toa-3.wav omnitone-toa-4.wav omnitone-toa-5.wav omnitone-toa-6.wav omnitone-toa-7.wav omnitone-toa-8.wav TEMP_A.wav
sox -t wav sh_hrir_order_3.wav TEMP_B.wav
md5 TEMP_A.wav TEMP_B.wav
rm TEMP_A.wav TEMP_B.wav
```

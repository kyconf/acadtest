import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from './Sidebar.module.css'
import logo1 from '../assets/logo1.png'


function LoginBox() {
  const navigate = useNavigate();

  const location = useLocation(); // Get the current route
  const navButton = (path) => {
      navigate(path); // Replace '/start-learning' with your desired route
  
  };

    // State to track if the button has been clicked
  

  
  return (
    <div className={styles.container}>
      <div className={styles.main}>
      <div className={styles.logoCon}>
      <img className={styles.logo1} src={logo1} alt="logo" /> 
      </div>
      
        <button className={`${styles.button} ${
          location.pathname === '/dashboard' ? styles.clicked : ''
        }`} onClick={() => navButton('/dashboard')}>
<svg version="1.0" xmlns="http://www.w3.org/2000/svg"
 width="1.5rem" height="1.5rem" viewBox="0 0 512.000000 512.000000"
 preserveAspectRatio="xMidYMid meet">

<g transform="translate(0.000000,512.000000) scale(0.100000,-0.100000)"
fill="black" stroke="#000000" stroke-width="-10000">
<path d="M2310 4583 c-685 -70 -1307 -405 -1739 -937 -160 -196 -328 -492
-416 -730 -70 -189 -124 -438 -145 -661 -34 -372 26 -788 166 -1143 76 -191
214 -450 278 -520 35 -39 90 -62 148 -62 48 0 78 12 277 109 124 60 240 121
259 136 110 88 89 260 -40 326 -72 37 -129 27 -277 -46 -73 -36 -136 -65 -141
-65 -13 0 -73 120 -125 250 -188 467 -204 989 -45 1466 l32 94 31 -14 c18 -8
86 -40 152 -72 145 -70 213 -81 280 -42 81 47 123 149 95 233 -23 71 -65 104
-228 182 -109 52 -151 76 -146 85 153 260 441 544 728 717 232 141 535 247
809 285 l97 13 0 -171 c0 -158 2 -175 23 -216 12 -24 39 -58 60 -74 36 -29 45
-31 117 -31 72 0 81 2 117 31 21 16 48 50 61 74 20 41 22 58 22 215 l0 171 92
-12 c181 -25 334 -66 525 -140 129 -51 177 -55 243 -21 124 62 145 226 41 320
-42 38 -227 115 -386 160 -117 34 -315 73 -437 86 -89 10 -446 13 -528 4z"/>
<path d="M4125 3865 c-72 -38 -1410 -968 -1730 -1204 -271 -199 -338 -269
-393 -411 -130 -330 62 -703 408 -795 71 -19 229 -19 300 0 89 23 197 84 259
145 72 71 184 219 458 605 336 474 953 1372 969 1410 32 77 3 171 -69 229 -32
26 -48 31 -105 34 -46 2 -76 -2 -97 -13z m-727 -1007 c-13 -18 -116 -163 -228
-323 -488 -693 -496 -701 -626 -693 -76 5 -126 38 -161 108 -47 90 -21 178 75
257 106 88 937 682 956 683 4 0 -3 -15 -16 -32z"/>
<path d="M4618 3180 c-48 -26 -84 -73 -99 -132 -12 -43 -11 -53 15 -125 90
-252 118 -341 140 -453 89 -444 43 -887 -135 -1292 -55 -125 -88 -188 -99
-188 -5 0 -72 29 -148 65 -115 54 -147 65 -191 65 -186 0 -272 -231 -128 -345
19 -15 137 -77 263 -136 202 -96 235 -109 282 -109 58 0 113 23 148 62 33 35
126 191 182 303 305 612 354 1316 137 1958 -75 221 -123 305 -191 333 -48 20
-132 17 -176 -6z"/>
</g>
</svg> Dashboard

      </button>
      <button className={`${styles.button} ${
          location.pathname === '/importai' ? styles.clicked : ''
        }`} onClick={() => navButton('/importai')}>
  
        <svg version="1.0" xmlns="http://www.w3.org/2000/svg"
 width="1.5rem" height="1.5rem" viewBox="0 0 512.000000 512.000000"
 preserveAspectRatio="xMidYMid meet">

<g transform="translate(0.000000,512.000000) scale(0.100000,-0.100000)"
fill="black" stroke="none">
<path d="M971 4944 c-169 -45 -301 -180 -346 -351 -23 -86 -23 -3440 0 -3526
46 -178 193 -320 368 -357 35 -7 240 -10 633 -8 l581 3 35 27 c44 33 73 103
64 149 -9 47 -44 97 -79 117 -29 15 -88 17 -614 22 -568 5 -582 5 -609 26 -15
11 -37 33 -48 48 l-21 27 0 1709 0 1709 21 27 c11 15 33 37 48 48 27 21 33 21
1272 24 1377 3 1286 7 1340 -64 l29 -37 5 -1031 c5 -979 6 -1033 23 -1061 31
-50 76 -75 136 -75 68 0 113 26 140 84 21 42 21 51 21 1053 0 645 -4 1030 -10
1064 -34 177 -177 327 -355 374 -86 22 -2550 22 -2634 -1z"/>
<path d="M1360 4278 c-47 -32 -71 -68 -77 -116 -7 -55 26 -123 75 -154 36 -22
45 -23 332 -26 204 -2 307 0 335 8 74 22 115 78 115 157 0 57 -26 105 -72 133
-31 19 -51 20 -354 20 -317 0 -322 0 -354 -22z"/>
<path d="M1394 3639 c-104 -30 -146 -168 -77 -249 53 -63 -4 -60 976 -60 l894
0 33 23 c72 49 95 115 65 193 -12 32 -29 53 -58 72 l-41 27 -880 2 c-514 1
-894 -2 -912 -8z"/>
<path d="M1374 2976 c-17 -8 -44 -31 -60 -52 -24 -31 -29 -47 -29 -94 0 -46 5
-63 27 -92 55 -73 -6 -69 992 -66 886 3 895 3 922 24 52 39 69 71 69 133 0 48
-5 64 -29 95 -53 69 -1 66 -978 66 -721 -1 -889 -3 -914 -14z"/>
<path d="M1360 2308 c-50 -34 -72 -71 -77 -125 -5 -65 26 -120 87 -150 l44
-23 756 0 c715 0 757 1 796 19 55 25 87 71 92 135 4 59 -20 105 -77 143 l-34
23 -777 0 -777 0 -33 -22z"/>
<path d="M3414 2219 c-41 -12 -97 -74 -117 -130 -115 -316 -139 -360 -247
-469 -91 -91 -165 -135 -319 -191 -64 -23 -137 -50 -162 -61 -174 -72 -166
-286 12 -351 331 -123 359 -138 469 -247 92 -92 135 -165 195 -329 65 -180 74
-198 116 -236 69 -62 176 -58 242 10 24 25 46 71 86 182 30 81 64 168 76 193
61 120 173 235 297 303 35 19 129 59 211 88 156 56 197 83 223 146 18 41 18
95 0 136 -26 63 -67 90 -223 146 -179 64 -241 96 -328 168 -120 98 -179 197
-266 441 -32 90 -53 133 -76 157 -48 49 -117 65 -189 44z m96 -616 c82 -147
226 -290 373 -373 31 -17 57 -33 57 -35 0 -2 -26 -18 -57 -35 -147 -83 -290
-226 -373 -373 l-33 -59 -20 34 c-106 178 -250 323 -405 408 l-42 24 32 19
c178 106 324 250 408 405 13 23 25 42 26 42 1 0 17 -26 34 -57z"/>
</g>
</svg>

        Import an exam
      </button>
      <button className={`${styles.button} ${
          location.pathname === '/create-exam' ? styles.clicked : ''
        }`} onClick={() => navButton('/create-exam')}>
          <svg version="1.0" xmlns="http://www.w3.org/2000/svg"
 width="1.5rem" height="1.5rem" viewBox="0 0 512.000000 512.000000"
 preserveAspectRatio="xMidYMid meet">

<g transform="translate(0.000000,512.000000) scale(0.100000,-0.100000)"
fill="#000000" stroke="none">
<path d="M1138 4835 c-204 -50 -378 -226 -429 -435 -12 -45 -14 -375 -14
-1850 l0 -1795 27 -80 c67 -196 227 -344 419 -390 96 -22 2742 -22 2838 0 198
47 365 208 428 415 16 50 18 167 20 1344 2 806 0 1308 -6 1341 -22 119 -14
110 -675 773 -557 558 -628 626 -686 655 l-65 32 -900 2 c-740 1 -910 -1 -957
-12z m1692 -687 c0 -428 3 -456 66 -581 47 -92 152 -199 244 -245 128 -64 136
-65 573 -69 l397 -4 0 -1208 c0 -1324 3 -1263 -59 -1349 -17 -22 -52 -53 -78
-69 l-48 -28 -1365 0 -1365 0 -48 28 c-26 16 -61 47 -78 70 -63 87 -59 -28
-57 1888 l3 1745 30 59 c33 64 82 109 141 130 32 12 185 14 842 15 l802 0 0
-382z m808 -576 c-272 -3 -315 4 -389 61 -25 18 -55 55 -71 86 l-28 53 0 267
0 266 365 -365 365 -365 -242 -3z"/>
<path d="M2507 2816 c-49 -18 -64 -32 -88 -77 -17 -34 -19 -61 -19 -244 l0
-205 -206 0 c-169 0 -212 -3 -240 -16 -50 -24 -77 -68 -82 -133 -5 -70 22
-115 88 -148 41 -22 57 -23 242 -23 l197 0 3 -214 c3 -235 4 -240 72 -290 39
-29 133 -29 172 0 68 50 69 55 72 290 l3 214 197 0 c185 0 201 1 242 23 66 33
93 78 88 148 -5 65 -32 109 -82 133 -28 13 -71 16 -240 16 l-206 0 0 205 c0
185 -2 210 -20 244 -35 69 -121 103 -193 77z"/>
</g>
</svg>
        Create Exam
      </button>

      <button className={`${styles.button} ${
          location.pathname === '/teacher' ? styles.clicked : ''
        }`} onClick={() => navButton('/teacher')}>
<svg version="1.0" xmlns="http://www.w3.org/2000/svg"
 width="1.5rem" height="1.5rem" viewBox="0 0 512.000000 512.000000"
 preserveAspectRatio="xMidYMid meet">

<g transform="translate(0.000000,512.000000) scale(0.100000,-0.100000)"
fill="#000000" stroke="none">
<path d="M2443 4479 c-34 -4 -88 -18 -120 -31 -60 -25 -2003 -1151 -2059
-1193 -51 -39 -84 -117 -84 -194 0 -80 22 -131 76 -182 22 -20 173 -114 337
-209 l297 -172 0 -402 c0 -220 5 -432 10 -471 7 -47 24 -98 51 -154 70 -141
96 -161 585 -443 236 -135 461 -262 499 -281 85 -42 210 -83 302 -97 75 -12
267 -15 329 -5 185 30 287 72 564 231 124 72 330 191 459 265 276 159 326 201
390 330 27 56 44 107 51 154 5 39 10 250 10 471 l0 401 130 76 130 75 0 -579
0 -580 -29 -25 c-17 -14 -42 -50 -57 -80 -23 -48 -26 -63 -22 -124 19 -263
357 -332 480 -97 35 66 32 166 -7 236 -16 29 -40 60 -52 68 l-23 15 0 669 0
668 28 15 c40 21 99 86 117 128 8 21 15 66 15 102 0 83 -36 156 -100 202 -25
17 -488 289 -1030 603 -737 428 -1001 577 -1050 591 -81 23 -148 29 -227 19z
m149 -297 c47 -17 1938 -1112 1938 -1122 -1 -4 -1163 -681 -1745 -1016 -208
-120 -242 -131 -324 -110 -29 7 -419 227 -1004 567 -526 305 -956 556 -956
559 -1 3 54 37 122 76 67 39 499 289 959 557 460 267 852 490 870 496 49 14
88 12 140 -7z m-837 -2187 c297 -172 565 -322 595 -332 81 -27 265 -25 341 4
31 11 169 86 305 165 654 381 823 478 838 484 15 6 16 -23 16 -317 0 -192 -4
-339 -10 -361 -25 -88 -48 -105 -490 -361 -467 -269 -522 -298 -635 -328 -112
-30 -288 -30 -400 0 -112 30 -166 58 -635 329 -442 255 -465 272 -490 360 -6
22 -10 169 -10 361 0 304 1 323 18 317 9 -4 260 -148 557 -321z"/>
</g>
</svg>

        Student List
      </button>

      <button className={`${styles.button} ${
          location.pathname === '/admin' ? styles.clicked : ''
        }`} onClick={() => navButton('/admin')}>
<svg version="1.0" xmlns="http://www.w3.org/2000/svg"
 width="1.5rem" height="1.5rem" viewBox="0 0 512.000000 512.000000"
 preserveAspectRatio="xMidYMid meet">

<g transform="translate(0.000000,512.000000) scale(0.100000,-0.100000)"
fill="#000000" stroke="none">
<path d="M2335 5105 c-273 -42 -517 -172 -708 -375 -210 -223 -319 -481 -334
-790 -21 -432 191 -845 557 -1084 180 -118 353 -178 563 -195 389 -30 721 92
989 365 262 267 379 596 347 974 -28 324 -171 603 -419 817 -196 168 -376 252
-625 288 -120 17 -260 18 -370 0z m426 -314 c157 -40 275 -109 407 -236 172
-163 259 -343 282 -576 27 -276 -58 -528 -245 -728 -116 -124 -287 -229 -432
-266 -215 -54 -471 -31 -655 60 -251 124 -437 356 -505 630 -26 105 -23 342 6
450 77 290 329 559 609 650 152 49 379 56 533 16z"/>
<path d="M1427 2639 c-153 -16 -311 -74 -436 -158 -312 -212 -514 -686 -561
-1316 -26 -354 -5 -529 86 -712 50 -102 145 -214 242 -286 74 -54 198 -110
307 -138 l90 -24 1400 0 1400 0 90 23 c316 83 537 296 616 597 41 155 36 525
-12 817 -105 650 -371 1040 -792 1162 -96 28 -268 49 -319 39 -49 -9 -117 -45
-271 -144 -166 -107 -192 -121 -316 -166 -146 -53 -255 -74 -390 -74 -140 0
-248 20 -390 70 -134 48 -140 51 -350 184 -110 70 -192 115 -224 124 -56 14
-56 14 -170 2z m260 -395 c188 -121 267 -160 432 -214 430 -141 869 -73 1283
198 187 123 183 121 262 111 363 -46 590 -351 686 -924 39 -236 51 -565 25
-690 -42 -201 -178 -343 -386 -402 -60 -17 -139 -18 -1434 -18 -1298 0 -1373
1 -1435 18 -149 42 -278 144 -338 267 -52 106 -65 195 -57 410 7 217 17 318
52 495 26 138 87 334 130 419 129 256 304 396 531 425 37 5 71 9 75 10 4 0 82
-47 174 -105z"/>
</g>
</svg>

        Profile
      </button>
      <button className={`${styles.button} ${
          location.pathname === '/announcements' ? styles.clicked : ''
        }`} onClick={() => navButton('/announcements')}><svg version="1.0" xmlns="http://www.w3.org/2000/svg"
 width="1.5rem" height="1.5rem" viewBox="0 0 512.000000 512.000000"
 preserveAspectRatio="xMidYMid meet">

<g transform="translate(0.000000,512.000000) scale(0.100000,-0.100000)"
fill="#000000" stroke="none">
<path d="M3895 4971 c-37 -17 -51 -38 -184 -267 -152 -262 -163 -293 -132
-352 29 -55 116 -78 170 -46 33 20 23 4 188 289 143 248 151 270 113 332 -34
56 -93 73 -155 44z"/>
<path d="M2380 4724 c-74 -20 -126 -52 -184 -114 -39 -42 -77 -110 -196 -353
-162 -333 -251 -494 -351 -637 -130 -186 -289 -347 -449 -454 -36 -24 -219
-133 -407 -241 -189 -109 -373 -222 -410 -250 -165 -125 -294 -342 -333 -556
-6 -33 -11 -111 -11 -173 1 -226 82 -432 237 -606 126 -139 332 -249 528 -281
115 -18 291 -7 400 25 49 15 90 25 91 24 1 -2 103 -178 226 -391 251 -434 280
-472 404 -532 185 -89 382 -60 533 79 64 60 111 138 137 230 22 75 16 208 -12
281 -11 28 -112 210 -225 405 -112 195 -210 365 -217 377 -11 22 -8 24 44 48
162 71 367 117 600 135 160 12 312 8 640 -16 313 -24 429 -23 494 3 79 32 129
71 178 137 73 99 97 240 60 351 -9 28 -97 189 -195 359 l-179 308 82 82 c63
62 91 98 118 156 107 224 84 461 -64 658 -148 196 -440 281 -680 198 -40 -14
-74 -24 -74 -23 -1 1 -80 139 -176 307 -135 235 -186 317 -229 360 -104 105
-238 142 -380 104z m187 -262 c19 -14 236 -381 686 -1160 361 -626 662 -1153
668 -1170 22 -63 -24 -145 -96 -172 -19 -7 -60 -9 -110 -5 -44 3 -174 13 -290
22 -253 19 -644 22 -775 5 -205 -27 -374 -69 -530 -134 -52 -22 -101 -41 -108
-41 -13 -2 -675 1130 -670 1144 2 3 48 42 103 86 127 101 271 250 365 378 117
157 218 335 391 685 89 179 168 333 177 344 43 48 134 57 189 18z m1020 -736
c74 -33 152 -111 185 -183 18 -38 22 -67 23 -143 0 -82 -4 -103 -26 -151 -25
-54 -92 -139 -109 -139 -9 0 -360 603 -360 618 0 18 73 31 150 28 56 -2 90 -9
137 -30z m-2133 -1478 c258 -447 326 -572 315 -579 -199 -122 -568 -324 -624
-342 -95 -30 -301 -32 -385 -3 -234 79 -397 249 -455 476 -13 50 -16 93 -13
185 4 103 9 132 36 202 63 171 161 274 377 398 76 44 197 115 269 157 72 42
136 77 141 77 6 0 158 -257 339 -571z m677 -1174 c188 -327 223 -393 227 -435
7 -74 -15 -136 -64 -186 -92 -92 -238 -90 -325 4 -26 27 -449 754 -449 770 0
6 368 227 387 233 0 0 101 -174 224 -386z"/>
<path d="M4620 4222 c-132 -68 -470 -270 -492 -293 -39 -40 -40 -114 -3 -158
33 -38 85 -56 125 -43 28 10 385 213 481 273 52 33 69 62 69 118 0 46 -30 88
-76 107 -44 18 -63 18 -104 -4z"/>
<path d="M4395 3220 c-90 -37 -97 -168 -12 -220 30 -19 52 -20 315 -20 312 0
332 3 365 59 21 36 22 93 2 131 -30 58 -45 60 -362 59 -158 0 -297 -4 -308 -9z"/>
</g>
</svg>
 Announcements</button>




      </div>

  </div>
  
  );
}

export default LoginBox;

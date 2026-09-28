import React from 'react';
import { GarmentType } from '../../types';

interface GarmentSilhouetteProps {
  garmentType: GarmentType;
  colorHex: string;
  side: 'front' | 'back';
  className?: string;
}

export const GarmentSilhouette: React.FC<GarmentSilhouetteProps> = ({
  garmentType,
  colorHex,
  side,
  className = 'w-full h-full',
}) => {
  // Common drop-shadow and texture filter for realistic apparel look
  const isDark = colorHex.toLowerCase() === '#1e293b';
  const seamColor = isDark ? 'rgba(255,255,255,0.18)' : 'rgba(0,0,0,0.12)';
  const shadowColor = isDark ? 'rgba(0,0,0,0.45)' : 'rgba(0,0,0,0.06)';
  const highlightColor = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.3)';

  switch (garmentType) {
    case 'romper_short':
    case 'romper_long':
      const isLong = garmentType === 'romper_long';
      return (
        <svg
          viewBox="0 0 400 480"
          className={className}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <filter id="garment-shadow" x="-5%" y="-5%" width="110%" height="110%">
              <feDropShadow dx="0" dy="4" stdDeviation="6" floodOpacity="0.08" floodColor="#000" />
            </filter>
            <linearGradient id="fabric-sheen" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor={highlightColor} />
              <stop offset="50%" stopColor="transparent" />
              <stop offset="100%" stopColor={shadowColor} />
            </linearGradient>
          </defs>

          {/* Garment Base Outline */}
          <path
            d={
              isLong
                ? "M145 45 C170 65, 230 65, 255 45 L325 90 L380 185 L350 200 L305 130 L305 320 L335 440 L285 445 L255 350 L200 350 L145 350 L115 445 L65 440 L95 320 L95 130 L50 200 L20 185 L75 90 Z"
                : "M145 45 C170 65, 230 65, 255 45 L320 85 L365 145 L335 165 L300 120 L300 320 C300 360, 260 400, 245 420 C235 432, 215 435, 200 435 C185 435, 165 432, 155 420 C140 400, 100 360, 100 320 L100 120 L65 165 L35 145 L80 85 Z"
            }
            fill={colorHex}
            filter="url(#garment-shadow)"
          />

          {/* Fabric Shading / Texture Overlay */}
          <path
            d={
              isLong
                ? "M145 45 C170 65, 230 65, 255 45 L325 90 L380 185 L350 200 L305 130 L305 320 L335 440 L285 445 L255 350 L200 350 L145 350 L115 445 L65 440 L95 320 L95 130 L50 200 L20 185 L75 90 Z"
                : "M145 45 C170 65, 230 65, 255 45 L320 85 L365 145 L335 165 L300 120 L300 320 C300 360, 260 400, 245 420 C235 432, 215 435, 200 435 C185 435, 165 432, 155 420 C140 400, 100 360, 100 320 L100 120 L65 165 L35 145 L80 85 Z"
            }
            fill="url(#fabric-sheen)"
          />

          {/* Neck Ribbing */}
          <path
            d={
              side === 'front'
                ? "M145 45 C175 75, 225 75, 255 45 C230 55, 170 55, 145 45 Z"
                : "M145 45 C175 52, 225 52, 255 45 C230 40, 170 40, 145 45 Z"
            }
            fill={shadowColor}
            stroke={seamColor}
            strokeWidth="1.5"
          />

          {/* Shoulder Seams */}
          <line x1="145" y1="45" x2="80" y2="85" stroke={seamColor} strokeWidth="1.5" strokeDasharray="3 2" />
          <line x1="255" y1="45" x2="320" y2="85" stroke={seamColor} strokeWidth="1.5" strokeDasharray="3 2" />

          {/* Sleeve Cuffs */}
          {!isLong && (
            <>
              <line x1="365" y1="145" x2="335" y2="165" stroke={seamColor} strokeWidth="2" />
              <line x1="35" y1="145" x2="65" y2="165" stroke={seamColor} strokeWidth="2" />
            </>
          )}

          {/* Front Snaps / Buttons at Bottom */}
          {side === 'front' && !isLong && (
            <g fill={isDark ? '#cbd5e1' : '#f8fafc'} stroke={seamColor} strokeWidth="1">
              <circle cx="180" cy="415" r="4.5" />
              <circle cx="200" cy="417" r="4.5" />
              <circle cx="220" cy="415" r="4.5" />
            </g>
          )}

          {/* Label Tag on Back */}
          {side === 'back' && (
            <rect x="186" y="55" width="28" height="16" rx="2" fill="rgba(255,255,255,0.7)" stroke={seamColor} strokeWidth="1" />
          )}
        </svg>
      );

    case 'bib':
      return (
        <svg viewBox="0 0 400 480" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <filter id="bib-shadow" x="-5%" y="-5%" width="110%" height="110%">
              <feDropShadow dx="0" dy="4" stdDeviation="6" floodOpacity="0.08" floodColor="#000" />
            </filter>
          </defs>
          {/* Bib straps and body */}
          <path
            d="M130 60 C100 80, 70 140, 80 230 C90 320, 130 400, 200 400 C270 400, 310 320, 320 230 C330 140, 300 80, 270 60 C250 85, 230 100, 200 100 C170 100, 150 85, 130 60 Z"
            fill={colorHex}
            filter="url(#bib-shadow)"
          />
          {/* Outer piped stitching */}
          <path
            d="M130 60 C100 80, 70 140, 80 230 C90 320, 130 400, 200 400 C270 400, 310 320, 320 230 C330 140, 300 80, 270 60"
            stroke={seamColor}
            strokeWidth="2.5"
            strokeDasharray="4 3"
          />
          {/* Neck snap button */}
          <circle cx="200" cy="55" r="5" fill="#f8fafc" stroke={seamColor} strokeWidth="1.5" />
        </svg>
      );

    case 'beanie':
      return (
        <svg viewBox="0 0 400 480" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <filter id="beanie-shadow" x="-5%" y="-5%" width="110%" height="110%">
              <feDropShadow dx="0" dy="4" stdDeviation="6" floodOpacity="0.08" floodColor="#000" />
            </filter>
          </defs>
          {/* Top knot */}
          <path d="M190 120 C185 100, 215 100, 210 120 Z" fill={colorHex} />
          {/* Beanie dome */}
          <path
            d="M90 300 C90 170, 140 120, 200 120 C260 120, 310 170, 310 300 Z"
            fill={colorHex}
            filter="url(#beanie-shadow)"
          />
          {/* Folded Cuff */}
          <rect x="80" y="270" width="240" height="60" rx="8" fill={colorHex} stroke={seamColor} strokeWidth="2" />
          {/* Ribbing texture */}
          <line x1="120" y1="270" x2="120" y2="330" stroke={seamColor} strokeWidth="1" strokeDasharray="2 3" />
          <line x1="160" y1="270" x2="160" y2="330" stroke={seamColor} strokeWidth="1" strokeDasharray="2 3" />
          <line x1="200" y1="270" x2="200" y2="330" stroke={seamColor} strokeWidth="1" strokeDasharray="2 3" />
          <line x1="240" y1="270" x2="240" y2="330" stroke={seamColor} strokeWidth="1" strokeDasharray="2 3" />
          <line x1="280" y1="270" x2="280" y2="330" stroke={seamColor} strokeWidth="1" strokeDasharray="2 3" />
        </svg>
      );

    case 'hoodie':
      return (
        <svg viewBox="0 0 400 480" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <filter id="hoodie-shadow" x="-5%" y="-5%" width="110%" height="110%">
              <feDropShadow dx="0" dy="4" stdDeviation="6" floodOpacity="0.08" floodColor="#000" />
            </filter>
          </defs>
          {/* Hood */}
          <path
            d="M130 85 C130 20, 270 20, 270 85 C250 110, 150 110, 130 85 Z"
            fill={colorHex}
            stroke={seamColor}
            strokeWidth="2"
          />
          {/* Body and Sleeves */}
          <path
            d="M135 85 L70 120 L25 210 L60 225 L95 160 L95 380 L305 380 L305 160 L340 225 L375 210 L330 120 L265 85 Z"
            fill={colorHex}
            filter="url(#hoodie-shadow)"
          />
          {/* Kangaroo Pocket (Front only) */}
          {side === 'front' && (
            <path
              d="M140 375 L160 300 L240 300 L260 375 Z"
              fill={colorHex}
              stroke={seamColor}
              strokeWidth="2"
            />
          )}
          {/* Drawstrings (Front only) */}
          {side === 'front' && (
            <g stroke={isDark ? '#e2e8f0' : '#475569'} strokeWidth="2.5" strokeLinecap="round">
              <path d="M185 95 C185 130, 180 150, 182 170" />
              <path d="M215 95 C215 130, 220 150, 218 170" />
            </g>
          )}
          {/* Bottom Hem & Cuffs */}
          <rect x="95" y="375" width="210" height="25" fill={shadowColor} stroke={seamColor} strokeWidth="1.5" />
          <line x1="25" y1="210" x2="60" y2="225" stroke={seamColor} strokeWidth="2" />
          <line x1="340" y1="225" x2="375" y2="210" stroke={seamColor} strokeWidth="2" />
        </svg>
      );

    case 'cotton_dress':
      return (
        <svg viewBox="0 0 400 480" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <filter id="dress-shadow" x="-5%" y="-5%" width="110%" height="110%">
              <feDropShadow dx="0" dy="4" stdDeviation="6" floodOpacity="0.08" floodColor="#000" />
            </filter>
          </defs>
          {/* Dress Body: Fitted top, flared skirt */}
          <path
            d="M150 50 C175 68, 225 68, 250 50 L295 90 L325 130 L295 145 L275 115 L265 190 L345 420 L55 420 L135 190 L125 115 L105 145 L75 130 L105 90 Z"
            fill={colorHex}
            filter="url(#dress-shadow)"
          />
          {/* Waist seam */}
          <path d="M135 190 Q200 200 265 190" stroke={seamColor} strokeWidth="2" />
          {/* Ruffle hem */}
          <path
            d="M55 420 Q90 410 130 420 Q170 410 200 420 Q240 410 280 420 Q315 410 345 420"
            stroke={seamColor}
            strokeWidth="2.5"
          />
          {/* Neckline */}
          <path
            d={
              side === 'front'
                ? "M150 50 C175 75, 225 75, 250 50"
                : "M150 50 C175 56, 225 56, 250 50"
            }
            stroke={seamColor}
            strokeWidth="2"
          />
        </svg>
      );

    case 'kids_tee':
    case 'youth_tee':
    case 'crewneck':
    case 'shorts_set':
    default:
      return (
        <svg viewBox="0 0 400 480" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <filter id="tee-shadow" x="-5%" y="-5%" width="110%" height="110%">
              <feDropShadow dx="0" dy="4" stdDeviation="6" floodOpacity="0.08" floodColor="#000" />
            </filter>
            <linearGradient id="tee-sheen" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor={highlightColor} />
              <stop offset="100%" stopColor={shadowColor} />
            </linearGradient>
          </defs>
          {/* T-Shirt Outline */}
          <path
            d="M140 50 C170 65, 230 65, 260 50 L325 85 L375 145 L335 175 L295 130 L295 400 L105 400 L105 130 L65 175 L25 145 L75 85 Z"
            fill={colorHex}
            filter="url(#tee-shadow)"
          />
          {/* Fabric sheen */}
          <path
            d="M140 50 C170 65, 230 65, 260 50 L325 85 L375 145 L335 175 L295 130 L295 400 L105 400 L105 130 L65 175 L25 145 L75 85 Z"
            fill="url(#tee-sheen)"
          />
          {/* Collar */}
          <path
            d={
              side === 'front'
                ? "M140 50 C170 82, 230 82, 260 50 C230 60, 170 60, 140 50 Z"
                : "M140 50 C170 56, 230 56, 260 50 C230 44, 170 44, 140 50 Z"
            }
            fill={shadowColor}
            stroke={seamColor}
            strokeWidth="1.5"
          />
          {/* Shoulder stitches */}
          <line x1="140" y1="50" x2="75" y2="85" stroke={seamColor} strokeWidth="1.5" strokeDasharray="3 2" />
          <line x1="260" y1="50" x2="325" y2="85" stroke={seamColor} strokeWidth="1.5" strokeDasharray="3 2" />
          {/* Sleeve ends */}
          <line x1="375" y1="145" x2="335" y2="175" stroke={seamColor} strokeWidth="2" />
          <line x1="25" y1="145" x2="65" y2="175" stroke={seamColor} strokeWidth="2" />
          {/* Bottom Hem */}
          <line x1="105" y1="392" x2="295" y2="392" stroke={seamColor} strokeWidth="1.5" strokeDasharray="4 2" />
        </svg>
      );
  }
};

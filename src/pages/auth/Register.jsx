/* eslint-disable react-hooks/set-state-in-effect, react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { logAction, LOG_ACTIONS } from '../../utils/activityLogger';
import {
  Eye, EyeOff, Mail, Lock, User, Phone, ChevronDown,
  Zap, Shield, ArrowRight, AlertCircle, CheckCircle2, BarChart2,
} from 'lucide-react';
import SolarSystemIllustration from '../../components/SolarSystemIllustration';
import '../../styles/auth.css';

/* ── Conversational Dynamic Headline & Tagline Component ──────── */
function DynamicWelcomeText() {
  const MESSAGES = [
    {
      headline: 'smarter energy',
      tagline: 'Real-time inverter monitoring, advanced analytics and intelligent control — all in one powerful platform.'
    },
    {
      headline: 'maximum uptime',
      tagline: 'Instantly detect inverter faults, track performance, and keep your solar fleet running at 100% efficiency.'
    },
    {
      headline: 'intelligent control',
      tagline: "We're analyzing your solar data in real-time to prevent failures before they happen. Welcome to the future."
    },
    {
      headline: 'secure operations',
      tagline: 'Manage team roles, track activity logs, and approve operators securely. Your fleet is safe with VoltIQ.'
    },
    {
      headline: 'clean intelligence',
      tagline: 'Ready to optimize your clean energy generation? Sign in now to explore live inverter diagnostics.'
    }
  ];

  const [curr, setCurr] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [taglineClass, setTaglineClass] = useState('au-tagline au-fade-in');

  useEffect(() => {
    let timer;
    const fullText = MESSAGES[curr].headline;
    const speed = isDeleting ? 40 : 80;

    if (isDeleting) {
      timer = setTimeout(() => {
        setDisplayText(fullText.substring(0, charIndex - 1));
        setCharIndex(prev => prev - 1);
      }, speed);
    } else {
      timer = setTimeout(() => {
        setDisplayText(fullText.substring(0, charIndex + 1));
        setCharIndex(prev => prev + 1);
      }, speed);
    }

    if (!isDeleting && charIndex === fullText.length) {
      timer = setTimeout(() => {
        setIsDeleting(true);
        setTaglineClass('au-tagline au-fade-out');
      }, 6000);
    } else if (isDeleting && charIndex === 0) {
      setIsDeleting(false);
      const nextIndex = (curr + 1) % MESSAGES.length;
      setCurr(nextIndex);
      setTaglineClass('au-tagline au-fade-in');
    }

    return () => clearTimeout(timer);
  }, [charIndex, isDeleting, curr]);

  return (
    <>
      <h1 className="au-headline">
        Welcome to<br />
        <span><span className="au-typewriter">{displayText}</span></span>
      </h1>
      <p className={taglineClass} key={curr}>
        {MESSAGES[curr].tagline}
      </p>
    </>
  );
}

/* ── Password strength meter ──────────────────────────────────── */
function PasswordStrength({ password }) {
  const checks = [
    password.length >= 8,
    /[A-Z]/.test(password),
    /[0-9]/.test(password),
    /[^A-Za-z0-9]/.test(password),
  ];
  const score = checks.filter(Boolean).length;
  const colors = ['', '#FF5E57', '#FFA500', '#7CFF00', '#7CFF00'];
  const labels = ['', 'Weak', 'Fair', 'Good', 'Strong'];
  if (!password) return null;
  return (
    <div>
      <div className="au-strength-bars">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="au-strength-bar"
            style={{ background: i <= score ? colors[score] : undefined }}
          />
        ))}
      </div>
      <span style={{ fontSize: 10.5, color: colors[score], fontWeight: 700 }}>{labels[score]}</span>
    </div>
  );
}




/* ── Country codes ──────────────────────────────────────────────── */
const COUNTRY_CODES = [
  { code: 'AF', dial: '+93', flag: '🇦🇫', name: 'Afghanistan' },
  { code: 'AX', dial: '+358-18', flag: '🇦🇽', name: 'Aland Islands' },
  { code: 'AL', dial: '+355', flag: '🇦🇱', name: 'Albania' },
  { code: 'DZ', dial: '+213', flag: '🇩🇿', name: 'Algeria' },
  { code: 'AS', dial: '+1-684', flag: '🇦🇸', name: 'American Samoa' },
  { code: 'AD', dial: '+376', flag: '🇦🇩', name: 'Andorra' },
  { code: 'AO', dial: '+244', flag: '🇦🇴', name: 'Angola' },
  { code: 'AI', dial: '+1-264', flag: '🇦🇮', name: 'Anguilla' },
  { code: 'AQ', dial: '+672', flag: '🇦🇶', name: 'Antarctica' },
  { code: 'AG', dial: '+1-268', flag: '🇦🇬', name: 'Antigua and Barbuda' },
  { code: 'AR', dial: '+54', flag: '🇦🇷', name: 'Argentina' },
  { code: 'AM', dial: '+374', flag: '🇦🇲', name: 'Armenia' },
  { code: 'AW', dial: '+297', flag: '🇦🇼', name: 'Aruba' },
  { code: 'AU', dial: '+61', flag: '🇦🇺', name: 'Australia' },
  { code: 'AT', dial: '+43', flag: '🇦🇹', name: 'Austria' },
  { code: 'AZ', dial: '+994', flag: '🇦🇿', name: 'Azerbaijan' },

  { code: 'BS', dial: '+1-242', flag: '🇧🇸', name: 'Bahamas' },
  { code: 'BH', dial: '+973', flag: '🇧🇭', name: 'Bahrain' },
  { code: 'BD', dial: '+880', flag: '🇧🇩', name: 'Bangladesh' },
  { code: 'BB', dial: '+1-246', flag: '🇧🇧', name: 'Barbados' },
  { code: 'BY', dial: '+375', flag: '🇧🇾', name: 'Belarus' },
  { code: 'BE', dial: '+32', flag: '🇧🇪', name: 'Belgium' },
  { code: 'BZ', dial: '+501', flag: '🇧🇿', name: 'Belize' },
  { code: 'BJ', dial: '+229', flag: '🇧🇯', name: 'Benin' },
  { code: 'BM', dial: '+1-441', flag: '🇧🇲', name: 'Bermuda' },
  { code: 'BT', dial: '+975', flag: '🇧🇹', name: 'Bhutan' },
  { code: 'BO', dial: '+591', flag: '🇧🇴', name: 'Bolivia' },
  { code: 'BQ', dial: '+599', flag: '🇧🇶', name: 'Bonaire, Sint Eustatius and Saba' },
  { code: 'BA', dial: '+387', flag: '🇧🇦', name: 'Bosnia and Herzegovina' },
  { code: 'BW', dial: '+267', flag: '🇧🇼', name: 'Botswana' },
  { code: 'BR', dial: '+55', flag: '🇧🇷', name: 'Brazil' },
  { code: 'IO', dial: '+246', flag: '🇮🇴', name: 'British Indian Ocean Territory' },
  { code: 'VG', dial: '+1-284', flag: '🇻🇬', name: 'British Virgin Islands' },
  { code: 'BN', dial: '+673', flag: '🇧🇳', name: 'Brunei' },
  { code: 'BG', dial: '+359', flag: '🇧🇬', name: 'Bulgaria' },
  { code: 'BF', dial: '+226', flag: '🇧🇫', name: 'Burkina Faso' },
  { code: 'BI', dial: '+257', flag: '🇧🇮', name: 'Burundi' },

  { code: 'CV', dial: '+238', flag: '🇨🇻', name: 'Cabo Verde' },
  { code: 'KH', dial: '+855', flag: '🇰🇭', name: 'Cambodia' },
  { code: 'CM', dial: '+237', flag: '🇨🇲', name: 'Cameroon' },
  { code: 'CA', dial: '+1', flag: '🇨🇦', name: 'Canada' },
  { code: 'KY', dial: '+1-345', flag: '🇰🇾', name: 'Cayman Islands' },
  { code: 'CF', dial: '+236', flag: '🇨🇫', name: 'Central African Republic' },
  { code: 'TD', dial: '+235', flag: '🇹🇩', name: 'Chad' },
  { code: 'CL', dial: '+56', flag: '🇨🇱', name: 'Chile' },
  { code: 'CN', dial: '+86', flag: '🇨🇳', name: 'China' },
  { code: 'CX', dial: '+61', flag: '🇨🇽', name: 'Christmas Island' },
  { code: 'CC', dial: '+61', flag: '🇨🇨', name: 'Cocos Islands' },
  { code: 'CO', dial: '+57', flag: '🇨🇴', name: 'Colombia' },
  { code: 'KM', dial: '+269', flag: '🇰🇲', name: 'Comoros' },
  { code: 'CG', dial: '+242', flag: '🇨🇬', name: 'Congo' },
  { code: 'CD', dial: '+243', flag: '🇨🇩', name: 'Democratic Republic of the Congo' },
  { code: 'CK', dial: '+682', flag: '🇨🇰', name: 'Cook Islands' },
  { code: 'CR', dial: '+506', flag: '🇨🇷', name: 'Costa Rica' },
  { code: 'CI', dial: '+225', flag: '🇨🇮', name: 'Côte d’Ivoire' },
  { code: 'HR', dial: '+385', flag: '🇭🇷', name: 'Croatia' },
  { code: 'CU', dial: '+53', flag: '🇨🇺', name: 'Cuba' },
  { code: 'CW', dial: '+599', flag: '🇨🇼', name: 'Curacao' },
  { code: 'CY', dial: '+357', flag: '🇨🇾', name: 'Cyprus' },
  { code: 'CZ', dial: '+420', flag: '🇨🇿', name: 'Czech Republic' },

  { code: 'DK', dial: '+45', flag: '🇩🇰', name: 'Denmark' },
  { code: 'DJ', dial: '+253', flag: '🇩🇯', name: 'Djibouti' },
  { code: 'DM', dial: '+1-767', flag: '🇩🇲', name: 'Dominica' },
  { code: 'DO', dial: '+1-809', flag: '🇩🇴', name: 'Dominican Republic' },

  { code: 'EC', dial: '+593', flag: '🇪🇨', name: 'Ecuador' },
  { code: 'EG', dial: '+20', flag: '🇪🇬', name: 'Egypt' },
  { code: 'SV', dial: '+503', flag: '🇸🇻', name: 'El Salvador' },
  { code: 'GQ', dial: '+240', flag: '🇬🇶', name: 'Equatorial Guinea' },
  { code: 'ER', dial: '+291', flag: '🇪🇷', name: 'Eritrea' },
  { code: 'EE', dial: '+372', flag: '🇪🇪', name: 'Estonia' },
  { code: 'SZ', dial: '+268', flag: '🇸🇿', name: 'Eswatini' },
  { code: 'ET', dial: '+251', flag: '🇪🇹', name: 'Ethiopia' },

  { code: 'FK', dial: '+500', flag: '🇫🇰', name: 'Falkland Islands' },
  { code: 'FO', dial: '+298', flag: '🇫🇴', name: 'Faroe Islands' },
  { code: 'FJ', dial: '+679', flag: '🇫🇯', name: 'Fiji' },
  { code: 'FI', dial: '+358', flag: '🇫🇮', name: 'Finland' },
  { code: 'FR', dial: '+33', flag: '🇫🇷', name: 'France' },
  { code: 'GF', dial: '+594', flag: '🇬🇫', name: 'French Guiana' },
  { code: 'PF', dial: '+689', flag: '🇵🇫', name: 'French Polynesia' },

  { code: 'GA', dial: '+241', flag: '🇬🇦', name: 'Gabon' },
  { code: 'GM', dial: '+220', flag: '🇬🇲', name: 'Gambia' },
  { code: 'GE', dial: '+995', flag: '🇬🇪', name: 'Georgia' },
  { code: 'DE', dial: '+49', flag: '🇩🇪', name: 'Germany' },
  { code: 'GH', dial: '+233', flag: '🇬🇭', name: 'Ghana' },
  { code: 'GI', dial: '+350', flag: '🇬🇮', name: 'Gibraltar' },
  { code: 'GR', dial: '+30', flag: '🇬🇷', name: 'Greece' },
  { code: 'GL', dial: '+299', flag: '🇬🇱', name: 'Greenland' },
  { code: 'GD', dial: '+1-473', flag: '🇬🇩', name: 'Grenada' },
  { code: 'GP', dial: '+590', flag: '🇬🇵', name: 'Guadeloupe' },
  { code: 'GU', dial: '+1-671', flag: '🇬🇺', name: 'Guam' },
  { code: 'GT', dial: '+502', flag: '🇬🇹', name: 'Guatemala' },
  { code: 'GG', dial: '+44-1481', flag: '🇬🇬', name: 'Guernsey' },
  { code: 'GN', dial: '+224', flag: '🇬🇳', name: 'Guinea' },
  { code: 'GW', dial: '+245', flag: '🇬🇼', name: 'Guinea-Bissau' },
  { code: 'GY', dial: '+592', flag: '🇬🇾', name: 'Guyana' },

  { code: 'HT', dial: '+509', flag: '🇭🇹', name: 'Haiti' },
  { code: 'HN', dial: '+504', flag: '🇭🇳', name: 'Honduras' },
  { code: 'HK', dial: '+852', flag: '🇭🇰', name: 'Hong Kong' },
  { code: 'HU', dial: '+36', flag: '🇭🇺', name: 'Hungary' },

  { code: 'IS', dial: '+354', flag: '🇮🇸', name: 'Iceland' },
  { code: 'IN', dial: '+91', flag: '🇮🇳', name: 'India' },
  { code: 'ID', dial: '+62', flag: '🇮🇩', name: 'Indonesia' },
  { code: 'IR', dial: '+98', flag: '🇮🇷', name: 'Iran' },
  { code: 'IQ', dial: '+964', flag: '🇮🇶', name: 'Iraq' },
  { code: 'IE', dial: '+353', flag: '🇮🇪', name: 'Ireland' },
  { code: 'IM', dial: '+44-1624', flag: '🇮🇲', name: 'Isle of Man' },
  { code: 'IL', dial: '+972', flag: '🇮🇱', name: 'Israel' },
  { code: 'IT', dial: '+39', flag: '🇮🇹', name: 'Italy' },

  { code: 'JM', dial: '+1-876', flag: '🇯🇲', name: 'Jamaica' },
  { code: 'JP', dial: '+81', flag: '🇯🇵', name: 'Japan' },
  { code: 'JE', dial: '+44-1534', flag: '🇯🇪', name: 'Jersey' },
  { code: 'JO', dial: '+962', flag: '🇯🇴', name: 'Jordan' },

  { code: 'KZ', dial: '+7', flag: '🇰🇿', name: 'Kazakhstan' },
  { code: 'KE', dial: '+254', flag: '🇰🇪', name: 'Kenya' },
  { code: 'KI', dial: '+686', flag: '🇰🇮', name: 'Kiribati' },
  { code: 'XK', dial: '+383', flag: '🇽🇰', name: 'Kosovo' },
  { code: 'KW', dial: '+965', flag: '🇰🇼', name: 'Kuwait' },
  { code: 'KG', dial: '+996', flag: '🇰🇬', name: 'Kyrgyzstan' },

  { code: 'LA', dial: '+856', flag: '🇱🇦', name: 'Laos' },
  { code: 'LV', dial: '+371', flag: '🇱🇻', name: 'Latvia' },
  { code: 'LB', dial: '+961', flag: '🇱🇧', name: 'Lebanon' },
  { code: 'LS', dial: '+266', flag: '🇱🇸', name: 'Lesotho' },
  { code: 'LR', dial: '+231', flag: '🇱🇷', name: 'Liberia' },
  { code: 'LY', dial: '+218', flag: '🇱🇾', name: 'Libya' },
  { code: 'LI', dial: '+423', flag: '🇱🇮', name: 'Liechtenstein' },
  { code: 'LT', dial: '+370', flag: '🇱🇹', name: 'Lithuania' },
  { code: 'LU', dial: '+352', flag: '🇱🇺', name: 'Luxembourg' },

  { code: 'MO', dial: '+853', flag: '🇲🇴', name: 'Macao' },
  { code: 'MG', dial: '+261', flag: '🇲🇬', name: 'Madagascar' },
  { code: 'MW', dial: '+265', flag: '🇲🇼', name: 'Malawi' },
  { code: 'MY', dial: '+60', flag: '🇲🇾', name: 'Malaysia' },
  { code: 'MV', dial: '+960', flag: '🇲🇻', name: 'Maldives' },
  { code: 'ML', dial: '+223', flag: '🇲🇱', name: 'Mali' },
  { code: 'MT', dial: '+356', flag: '🇲🇹', name: 'Malta' },
  { code: 'MH', dial: '+692', flag: '🇲🇭', name: 'Marshall Islands' },
  { code: 'MQ', dial: '+596', flag: '🇲🇶', name: 'Martinique' },
  { code: 'MR', dial: '+222', flag: '🇲🇷', name: 'Mauritania' },
  { code: 'MU', dial: '+230', flag: '🇲🇺', name: 'Mauritius' },
  { code: 'YT', dial: '+262', flag: '🇾🇹', name: 'Mayotte' },
  { code: 'MX', dial: '+52', flag: '🇲🇽', name: 'Mexico' },
  { code: 'FM', dial: '+691', flag: '🇫🇲', name: 'Micronesia' },
  { code: 'MD', dial: '+373', flag: '🇲🇩', name: 'Moldova' },
  { code: 'MC', dial: '+377', flag: '🇲🇨', name: 'Monaco' },
  { code: 'MN', dial: '+976', flag: '🇲🇳', name: 'Mongolia' },
  { code: 'ME', dial: '+382', flag: '🇲🇪', name: 'Montenegro' },
  { code: 'MS', dial: '+1-664', flag: '🇲🇸', name: 'Montserrat' },
  { code: 'MA', dial: '+212', flag: '🇲🇦', name: 'Morocco' },
  { code: 'MZ', dial: '+258', flag: '🇲🇿', name: 'Mozambique' },
  { code: 'MM', dial: '+95', flag: '🇲🇲', name: 'Myanmar' },

  { code: 'NA', dial: '+264', flag: '🇳🇦', name: 'Namibia' },
  { code: 'NR', dial: '+674', flag: '🇳🇷', name: 'Nauru' },
  { code: 'NP', dial: '+977', flag: '🇳🇵', name: 'Nepal' },
  { code: 'NL', dial: '+31', flag: '🇳🇱', name: 'Netherlands' },
  { code: 'NC', dial: '+687', flag: '🇳🇨', name: 'New Caledonia' },
  { code: 'NZ', dial: '+64', flag: '🇳🇿', name: 'New Zealand' },
  { code: 'NI', dial: '+505', flag: '🇳🇮', name: 'Nicaragua' },
  { code: 'NE', dial: '+227', flag: '🇳🇪', name: 'Niger' },
  { code: 'NG', dial: '+234', flag: '🇳🇬', name: 'Nigeria' },
  { code: 'NU', dial: '+683', flag: '🇳🇺', name: 'Niue' },
  { code: 'NF', dial: '+672', flag: '🇳🇫', name: 'Norfolk Island' },
  { code: 'KP', dial: '+850', flag: '🇰🇵', name: 'North Korea' },
  { code: 'MK', dial: '+389', flag: '🇲🇰', name: 'North Macedonia' },
  { code: 'MP', dial: '+1-670', flag: '🇲🇵', name: 'Northern Mariana Islands' },
  { code: 'NO', dial: '+47', flag: '🇳🇴', name: 'Norway' },

  { code: 'OM', dial: '+968', flag: '🇴🇲', name: 'Oman' },

  { code: 'PK', dial: '+92', flag: '🇵🇰', name: 'Pakistan' },
  { code: 'PW', dial: '+680', flag: '🇵🇼', name: 'Palau' },
  { code: 'PS', dial: '+970', flag: '🇵🇸', name: 'Palestine' },
  { code: 'PA', dial: '+507', flag: '🇵🇦', name: 'Panama' },
  { code: 'PG', dial: '+675', flag: '🇵🇬', name: 'Papua New Guinea' },
  { code: 'PY', dial: '+595', flag: '🇵🇾', name: 'Paraguay' },
  { code: 'PE', dial: '+51', flag: '🇵🇪', name: 'Peru' },
  { code: 'PH', dial: '+63', flag: '🇵🇭', name: 'Philippines' },
  { code: 'PN', dial: '+64', flag: '🇵🇳', name: 'Pitcairn Islands' },
  { code: 'PL', dial: '+48', flag: '🇵🇱', name: 'Poland' },
  { code: 'PT', dial: '+351', flag: '🇵🇹', name: 'Portugal' },
  { code: 'PR', dial: '+1-787', flag: '🇵🇷', name: 'Puerto Rico' },

  { code: 'QA', dial: '+974', flag: '🇶🇦', name: 'Qatar' },

  { code: 'RE', dial: '+262', flag: '🇷🇪', name: 'Reunion' },
  { code: 'RO', dial: '+40', flag: '🇷🇴', name: 'Romania' },
  { code: 'RU', dial: '+7', flag: '🇷🇺', name: 'Russia' },
  { code: 'RW', dial: '+250', flag: '🇷🇼', name: 'Rwanda' },

  { code: 'BL', dial: '+590', flag: '🇧🇱', name: 'Saint Barthelemy' },
  { code: 'SH', dial: '+290', flag: '🇸🇭', name: 'Saint Helena' },
  { code: 'KN', dial: '+1-869', flag: '🇰🇳', name: 'Saint Kitts and Nevis' },
  { code: 'LC', dial: '+1-758', flag: '🇱🇨', name: 'Saint Lucia' },
  { code: 'MF', dial: '+590', flag: '🇲🇫', name: 'Saint Martin' },
  { code: 'PM', dial: '+508', flag: '🇵🇲', name: 'Saint Pierre and Miquelon' },
  { code: 'VC', dial: '+1-784', flag: '🇻🇨', name: 'Saint Vincent and the Grenadines' },
  { code: 'WS', dial: '+685', flag: '🇼🇸', name: 'Samoa' },
  { code: 'SM', dial: '+378', flag: '🇸🇲', name: 'San Marino' },
  { code: 'ST', dial: '+239', flag: '🇸🇹', name: 'Sao Tome and Principe' },
  { code: 'SA', dial: '+966', flag: '🇸🇦', name: 'Saudi Arabia' },
  { code: 'SN', dial: '+221', flag: '🇸🇳', name: 'Senegal' },
  { code: 'RS', dial: '+381', flag: '🇷🇸', name: 'Serbia' },
  { code: 'SC', dial: '+248', flag: '🇸🇨', name: 'Seychelles' },
  { code: 'SL', dial: '+232', flag: '🇸🇱', name: 'Sierra Leone' },
  { code: 'SG', dial: '+65', flag: '🇸🇬', name: 'Singapore' },
  { code: 'SX', dial: '+1-721', flag: '🇸🇽', name: 'Sint Maarten' },
  { code: 'SK', dial: '+421', flag: '🇸🇰', name: 'Slovakia' },
  { code: 'SI', dial: '+386', flag: '🇸🇮', name: 'Slovenia' },
  { code: 'SB', dial: '+677', flag: '🇸🇧', name: 'Solomon Islands' },
  { code: 'SO', dial: '+252', flag: '🇸🇴', name: 'Somalia' },
  { code: 'ZA', dial: '+27', flag: '🇿🇦', name: 'South Africa' },
  { code: 'KR', dial: '+82', flag: '🇰🇷', name: 'South Korea' },
  { code: 'SS', dial: '+211', flag: '🇸🇸', name: 'South Sudan' },
  { code: 'ES', dial: '+34', flag: '🇪🇸', name: 'Spain' },
  { code: 'LK', dial: '+94', flag: '🇱🇰', name: 'Sri Lanka' },
  { code: 'SD', dial: '+249', flag: '🇸🇩', name: 'Sudan' },
  { code: 'SR', dial: '+597', flag: '🇸🇷', name: 'Suriname' },
  { code: 'SJ', dial: '+47', flag: '🇸🇯', name: 'Svalbard and Jan Mayen' },
  { code: 'SE', dial: '+46', flag: '🇸🇪', name: 'Sweden' },
  { code: 'CH', dial: '+41', flag: '🇨🇭', name: 'Switzerland' },
  { code: 'SY', dial: '+963', flag: '🇸🇾', name: 'Syria' },

  { code: 'TW', dial: '+886', flag: '🇹🇼', name: 'Taiwan' },
  { code: 'TJ', dial: '+992', flag: '🇹🇯', name: 'Tajikistan' },
  { code: 'TZ', dial: '+255', flag: '🇹🇿', name: 'Tanzania' },
  { code: 'TH', dial: '+66', flag: '🇹🇭', name: 'Thailand' },
  { code: 'TL', dial: '+670', flag: '🇹🇱', name: 'Timor-Leste' },
  { code: 'TG', dial: '+228', flag: '🇹🇬', name: 'Togo' },
  { code: 'TK', dial: '+690', flag: '🇹🇰', name: 'Tokelau' },
  { code: 'TO', dial: '+676', flag: '🇹🇴', name: 'Tonga' },
  { code: 'TT', dial: '+1-868', flag: '🇹🇹', name: 'Trinidad and Tobago' },
  { code: 'TN', dial: '+216', flag: '🇹🇳', name: 'Tunisia' },
  { code: 'TR', dial: '+90', flag: '🇹🇷', name: 'Turkey' },
  { code: 'TM', dial: '+993', flag: '🇹🇲', name: 'Turkmenistan' },
  { code: 'TC', dial: '+1-649', flag: '🇹🇨', name: 'Turks and Caicos Islands' },
  { code: 'TV', dial: '+688', flag: '🇹🇻', name: 'Tuvalu' },

  { code: 'UG', dial: '+256', flag: '🇺🇬', name: 'Uganda' },
  { code: 'UA', dial: '+380', flag: '🇺🇦', name: 'Ukraine' },
  { code: 'AE', dial: '+971', flag: '🇦🇪', name: 'United Arab Emirates' },
  { code: 'GB', dial: '+44', flag: '🇬🇧', name: 'United Kingdom' },
  { code: 'US', dial: '+1', flag: '🇺🇸', name: 'United States' },
  { code: 'UY', dial: '+598', flag: '🇺🇾', name: 'Uruguay' },
  { code: 'UZ', dial: '+998', flag: '🇺🇿', name: 'Uzbekistan' },

  { code: 'VU', dial: '+678', flag: '🇻🇺', name: 'Vanuatu' },
  { code: 'VA', dial: '+39-06', flag: '🇻🇦', name: 'Vatican City' },
  { code: 'VE', dial: '+58', flag: '🇻🇪', name: 'Venezuela' },
  { code: 'VN', dial: '+84', flag: '🇻🇳', name: 'Vietnam' },
  { code: 'VI', dial: '+1-340', flag: '🇻🇮', name: 'U.S. Virgin Islands' },

  { code: 'WF', dial: '+681', flag: '🇼🇫', name: 'Wallis and Futuna' },
  { code: 'EH', dial: '+212', flag: '🇪🇭', name: 'Western Sahara' },

  { code: 'YE', dial: '+967', flag: '🇾🇪', name: 'Yemen' },

  { code: 'ZM', dial: '+260', flag: '🇿🇲', name: 'Zambia' },
  { code: 'ZW', dial: '+263', flag: '🇿🇼', name: 'Zimbabwe' },
];

/* ── Stats (same as login) ──────────────────────────────────────── */
const STATS = [
  { icon: <Zap size={16} />, val: '48', lbl: 'Inverters Monitored' },
  { icon: <BarChart2 size={16} />, val: '97.4%', lbl: 'Avg. Efficiency' },
  { icon: <Shield size={16} />, val: '99.9%', lbl: 'System Uptime' },
];

/* ── Features list ──────────────────────────────────────────────── */
/* ── Custom Search-enabled Country Code Selector ────────────── */
function CountrySelector({ value, onChange, disabled }) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  
  const selected = COUNTRY_CODES.find(c => c.code === value) || COUNTRY_CODES[0];

  const filtered = COUNTRY_CODES.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.dial.includes(search) ||
    c.code.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    if (!isOpen) return;
    const handleOutside = (e) => {
      if (!e.target.closest('.au-custom-select-container')) {
        setIsOpen(false);
      }
    };
    document.addEventListener('click', handleOutside);
    return () => document.removeEventListener('click', handleOutside);
  }, [isOpen]);

  return (
    <div className="au-custom-select-container" style={{ position: 'relative' }}>
      <button
        type="button"
        className={`au-select-trigger ${isOpen ? 'au-select-trigger--open' : ''}`}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
      >
        <span>{selected.code}</span>
        <span>{selected.dial}</span>
        <span className="au-select-chevron">
          <ChevronDown size={13} style={{ transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
        </span>
      </button>

      {isOpen && (
        <div className="au-select-dropdown">
          {/* Search Input */}
          <div style={{ padding: '8px', borderBottom: '1px solid rgba(212, 175, 55, 0.2)', background: 'rgba(18, 15, 12, 0.98)' }}>
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              onClick={e => e.stopPropagation()}
              style={{
                width: '100%',
                background: 'rgba(12, 10, 9, 0.95)',
                border: '1px solid rgba(212, 175, 55, 0.25)',
                borderRadius: '8px',
                padding: '6px 10px',
                fontSize: '12px',
                color: '#fff',
                outline: 'none'
              }}
              autoFocus
            />
          </div>

          {/* Options List */}
          <div className="au-custom-scrollbar" style={{ overflowY: 'auto', flex: 1, padding: '4px 0' }}>
            {filtered.length === 0 ? (
              <div style={{ padding: '12px', fontSize: '12px', color: 'rgba(255, 255, 255, 0.4)', textAlign: 'center' }}>
                No match
              </div>
            ) : (
              filtered.map(c => (
                <div
                  key={c.code}
                  onClick={() => {
                    onChange(c.code);
                    setIsOpen(false);
                    setSearch('');
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '8px 12px',
                    fontSize: '13px',
                    color: '#fff',
                    cursor: 'pointer',
                    background: c.code === value ? 'rgba(212, 175, 55, 0.15)' : 'transparent',
                    borderLeft: c.code === value ? '3px solid #ffd97d' : '3px solid transparent',
                    transition: 'background 0.2s'
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'}
                  onMouseLeave={e => e.currentTarget.style.background = c.code === value ? 'rgba(212, 175, 55, 0.15)' : 'transparent'}
                >
                  <span style={{ fontSize: '12px', fontWeight: 800, color: '#ffd97d', width: '24px' }}>{c.code}</span>
                  <span style={{ fontWeight: 600, width: '45px' }}>{c.dial}</span>
                  <span style={{ color: 'rgba(255, 255, 255, 0.5)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.name}</span>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Main Register Component ────────────────────────────────────── */
export default function Register() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [countryCode, setCountryCode] = useState('EG');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPwd, setConfirmPwd] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [sessionClearing, setSessionClearing] = useState(false);

  const { user, loading: authLoading, isApproved, userStatus, register, loginWithGoogle, forceLogout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && user) {
      navigate('/dashboard', { replace: true });
    }
  }, [authLoading, navigate, user]);

  const selectedCountry = COUNTRY_CODES.find(c => c.code === countryCode) || COUNTRY_CODES[0];

  const validate = () => {
    if (!firstName.trim()) { setError('Please enter your first name.'); return false; }
    if (!lastName.trim()) { setError('Please enter your last name.'); return false; }
    if (!email.trim()) { setError('Please enter your email address.'); return false; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setError('Please enter a valid email.'); return false; }
    if (!phone.trim()) { setError('Please enter your phone number.'); return false; }
    if (!/^\d{7,15}$/.test(phone.trim())) { setError('Phone must be 7–15 digits.'); return false; }
    if (!password) { setError('Please create a password.'); return false; }
    if (password.length < 8) { setError('Password must be at least 8 characters.'); return false; }
    if (password !== confirmPwd) { setError('Passwords do not match.'); return false; }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    if (!validate()) return;
    if (user && !isApproved) {
      setError('Sign out of the current pending account first, then create another account.');
      return;
    }
    setLoading(true);

    const fullName = `${firstName.trim()} ${lastName.trim()}`;
    const fullPhone = `${selectedCountry.dial}${phone.trim()}`;

    try {
      const cred = await register(email.trim(), password, fullName, fullPhone, {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        countryCode,
      });
      try {
        await logAction(cred.user, LOG_ACTIONS.REGISTER, {
          email: cred.user.email,
          note: 'New account created (pending approval)',
        });
      } catch { /* non-fatal */ }

      setSuccess('Account created successfully. Awaiting administrator approval...');
      setTimeout(() => {
        navigate('/dashboard', { replace: true });
      }, 1500);
    } catch (err) {
      let msg = 'Failed to create account. Please try again.';
      if (err.code === 'auth/email-already-in-use') msg = 'An account with this email already exists.';
      else if (err.code === 'auth/invalid-email') msg = 'The email address is invalid.';
      else if (err.message?.includes('8 characters')) msg = 'Password must be at least 8 characters long.';
      setError(msg);
    } finally { setLoading(false); }
  };

  const handleGoogle = async () => {
    setError('');
    if (user && !isApproved) {
      setError('Sign out of the current pending account first, then continue with Google.');
      return;
    }
    setGoogleLoading(true);
    try {
      await loginWithGoogle();
    } catch (err) {
      if (err.message !== 'Google sign-in was cancelled.') {
        setError(err.message || 'Google sign-up failed.');
      }
    } finally { setGoogleLoading(false); }
  };

  const handleSignOutCurrent = async () => {
    setError('');
    setSessionClearing(true);
    try {
      await forceLogout();
      window.location.replace('/register');
    } catch {
      setError('Could not sign out the current account. Please refresh and try again.');
    } finally {
      setSessionClearing(false);
    }
  };

  return (
    <div className="au-page">

      {/* ══════════ LEFT SIDE ══════════ */}
      <div className="au-left">
        <div className="au-left__bg" />
        <div className="au-left__overlay" />
        <div className="au-left__content">

          {/* Brand */}
          <Link to="/" className="au-brand">
            <Zap size={22} className="au-brand__icon" />
            <span className="au-brand__name">VoltIQ</span>
          </Link>

          {/* Badge */}
          <div className="au-badge">
            <Zap size={11} />
            Enterprise Solar Intelligence
          </div>

          {/* Headline & Tagline (Dynamic & Conversational) */}
          <DynamicWelcomeText />

          {/* Stats */}
          <div className="au-stats">
            {STATS.map(s => (
              <div key={s.lbl} className="au-stat">
                <div className="au-stat__icon">{s.icon}</div>
                <div>
                  <span className="au-stat__val">{s.val}</span>
                  <span className="au-stat__lbl">{s.lbl}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Premium Illustration Component */}
          <SolarSystemIllustration />

        </div>
      </div>

      {/* ══════════ RIGHT SIDE ══════════ */}
      <div className="au-right">
        <div className="au-card">

          {/* Tabs */}
          <div className="au-tabs">
            <Link to="/login" className="au-tab au-tab--inactive">
              <Lock size={13} /> Log in
            </Link>
            <span className="au-tab au-tab--active">
              Create account
            </span>
          </div>

          <div className="au-card__body">

            {/* Icon */}
            <div className="au-card__icon"><User size={20} /></div>

            <h2 className="au-card__title">
              Create your <span>VoltIQ</span> account
            </h2>
            <p className="au-card__sub">Fill in your details to get started with VoltIQ.</p>

            {/* Alerts */}
            {user && !isApproved && (
              <div className="au-alert au-alert--error">
                <AlertCircle size={15} />
                <span>
                  Current account is {userStatus}. Sign out first, then create or use another account.
                </span>
                <button type="button" className="au-alert-action" onClick={handleSignOutCurrent}>
                  {sessionClearing ? 'Signing out...' : 'Sign out'}
                </button>
              </div>
            )}
            {error && (
              <div className="au-alert au-alert--error" role="alert">
                <AlertCircle size={15} /> {error}
              </div>
            )}
            {success && (
              <div className="au-alert au-alert--success" role="status">
                <CheckCircle2 size={15} /> {success}
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate>

              {/* First Name + Last Name */}
              <div className="au-grid-2">
                <div className="au-field">
                  <label className="au-label" htmlFor="reg-firstname">First Name</label>
                  <div className="au-input-wrap">
                    <span className="au-input-icon"><User size={14} /></span>
                    <input
                      id="reg-firstname"
                      type="text"
                      className="au-input"
                      placeholder="Ahmed"
                      value={firstName}
                      onChange={e => setFirstName(e.target.value)}
                      autoComplete="given-name"
                      disabled={loading}
                      required
                    />
                  </div>
                </div>

                <div className="au-field">
                  <label className="au-label" htmlFor="reg-lastname">Last Name</label>
                  <div className="au-input-wrap">
                    <span className="au-input-icon"><User size={14} /></span>
                    <input
                      id="reg-lastname"
                      type="text"
                      className="au-input"
                      placeholder="Hassan"
                      value={lastName}
                      onChange={e => setLastName(e.target.value)}
                      autoComplete="family-name"
                      disabled={loading}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Email */}
              <div className="au-field">
                <label className="au-label" htmlFor="reg-email">Email Address</label>
                <div className="au-input-wrap">
                  <span className="au-input-icon"><Mail size={14} /></span>
                  <input
                    id="reg-email"
                    type="email"
                    className="au-input"
                    placeholder="you@company.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    autoComplete="email"
                    disabled={loading}
                    required
                  />
                </div>
              </div>

              {/* Phone */}
              <div className="au-field">
                <label className="au-label" htmlFor="reg-phone">Phone Number</label>
                <div className="au-phone-row">
                  {/* Country code */}
                  <div className="au-select-wrap">
                    <CountrySelector
                      value={countryCode}
                      onChange={setCountryCode}
                      disabled={loading}
                    />
                  </div>
                  {/* Number */}
                  <div className="au-input-wrap" style={{ flex: 1 }}>
                    <span className="au-input-icon"><Phone size={14} /></span>
                    <input
                      id="reg-phone"
                      type="tel"
                      className="au-input"
                      placeholder="1012345678"
                      value={phone}
                      onChange={e => setPhone(e.target.value.replace(/\D/g, ''))}
                      autoComplete="tel-national"
                      disabled={loading}
                      required
                    />
                  </div>
                </div>
                {phone && (
                  <div className="au-phone-preview">
                    Full: {selectedCountry.code} {selectedCountry.dial} {phone}
                  </div>
                )}
              </div>

              {/* Password + Confirm */}
              <div className="au-grid-2">
                <div className="au-field">
                  <label className="au-label" htmlFor="reg-password">Password</label>
                  <div className="au-input-wrap">
                    <span className="au-input-icon"><Lock size={14} /></span>
                    <input
                      id="reg-password"
                      type={showPwd ? 'text' : 'password'}
                      className="au-input au-input--pr"
                      placeholder="Min. 8 characters"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      autoComplete="new-password"
                      disabled={loading}
                      required
                    />
                    <button type="button" className="au-eye-btn"
                      onClick={() => setShowPwd(v => !v)} tabIndex={-1}
                      aria-label={showPwd ? 'Hide' : 'Show'}>
                      {showPwd ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                  <PasswordStrength password={password} />
                </div>

                <div className="au-field">
                  <label className="au-label" htmlFor="reg-confirm">Confirm Password</label>
                  <div className="au-input-wrap">
                    <span className="au-input-icon"><Lock size={14} /></span>
                    <input
                      id="reg-confirm"
                      type={showConfirm ? 'text' : 'password'}
                      className="au-input au-input--pr"
                      placeholder="Re-enter password"
                      value={confirmPwd}
                      onChange={e => setConfirmPwd(e.target.value)}
                      autoComplete="new-password"
                      disabled={loading}
                      required
                    />
                    <button type="button" className="au-eye-btn"
                      onClick={() => setShowConfirm(v => !v)} tabIndex={-1}
                      aria-label={showConfirm ? 'Hide' : 'Show'}>
                      {showConfirm ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                  {confirmPwd && (
                    <div className={`au-match ${confirmPwd === password ? 'au-match--ok' : 'au-match--bad'}`}>
                      {confirmPwd === password ? '✓ Passwords match' : '✗ Do not match'}
                    </div>
                  )}
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                id="register-submit-btn"
                className="au-btn-primary"
                style={{ marginTop: 18 }}
                disabled={loading || googleLoading}
              >
                {loading
                  ? <><span className="au-spinner" /> Creating account…</>
                  : <><ArrowRight size={16} /> Create VoltIQ account</>
                }
              </button>
            </form>

            {/* OR */}
            <div className="au-or">OR</div>

            {/* Google */}
            <button
              id="google-register-btn"
              className="au-btn-google"
              onClick={handleGoogle}
              disabled={loading || googleLoading}
            >
              {googleLoading ? (
                <><span className="au-spinner au-spinner--white" /> Connecting…</>
              ) : (
                <>
                  <svg width="17" height="17" viewBox="0 0 18 18" fill="none">
                    <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4" />
                    <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853" />
                    <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05" />
                    <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335" />
                  </svg>
                  Sign up with Google
                </>
              )}
            </button>

            {/* Switch */}
            <p className="au-switch">
              Already have an account?
              <button className="au-switch__link" onClick={() => navigate('/login')} type="button">
                Log in
              </button>
            </p>

            {/* Security */}
            <div className="au-security">
              <span className="au-security__item"><Shield size={11} /> 256-bit encrypted</span>
              <span className="au-security__sep">|</span>
              <span className="au-security__item"><Lock size={11} /> Instant access</span>
              <span className="au-security__sep">|</span>
              <span className="au-security__item"><Shield size={11} /> GDPR compliant</span>
            </div>

          </div>
        </div>
      </div>

    </div>
  );
}

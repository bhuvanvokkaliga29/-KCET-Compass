#!/usr/bin/env python3
"""
KCET Compass - PDF to JSON Converter
Parses KCET cutoff PDFs and generates unified all_cutoffs.json
"""

import pdfplumber
import json
import re
import os

# Branch code to full name mapping
BRANCH_MAP = {
    "AI": "Artificial Intelligence",
    "AD": "Artificial Intelligence & Data Science",
    "AR": "Architecture",
    "BT": "Bio Technology",
    "CA": "Computer Science (AI & ML)",
    "CE": "Civil Engineering",
    "CH": "Chemical Engineering",
    "CS": "Computer Science and Engineering",
    "CT": "Computer Science & Technology",
    "CY": "Computer Science & Cyber Security",
    "EC": "Electronics and Communication Engineering",
    "EE": "Electrical and Electronics Engineering",
    "EI": "Electronics & Instrumentation Engineering",
    "ET": "Electronics & Telecommunication Engineering",
    "IE": "Information Science and Engineering",
    "IM": "Industrial Engineering & Management",
    "ME": "Mechanical Engineering",
    "MR": "Mechatronics Engineering",
    "MI": "Mining Engineering",
    "SE": "Aerospace Engineering",
    "ST": "Silk Technology",
    "TX": "Textile Technology",
    "RI": "Robotics & AI",
    "DS": "Data Science",
    "CW": "Computer Science & Engineering (IoT & Cyber Security)",
    "AU": "Automobile Engineering",
    "MD": "Medical Electronics",
    "IP": "Industrial Production Engineering",
    "PT": "Polymer Science & Technology",
    "EN": "Environmental Engineering",
    "ML": "Machine Learning",
}

CITY_KEYWORDS = {
    "Bangalore": ["Bangalore", "Bengaluru", "Basavanagudi", "Rajajinagar", "Jayanagar", "Vijayanagar", "Peenya", "Yeshwanthpur", "Kengeri"],
    "Mysore": ["Mysore", "Mysuru"],
    "Mangalore": ["Mangalore", "Mangaluru", "Surathkal"],
    "Hubli": ["Hubli", "Hubballi", "Dharwad", "Dharwar"],
    "Belagavi": ["Belagavi", "Belgaum", "Belgavi"],
    "Davanagere": ["Davanagere", "Davangere"],
    "Shivamogga": ["Shivamogga", "Shimoga"],
    "Tumkur": ["Tumkur", "Tumakuru"],
    "Kalaburagi": ["Kalaburagi", "Gulbarga"],
    "Raichur": ["Raichur"],
    "Ballari": ["Ballari", "Bellary"],
    "Hassan": ["Hassan"],
    "Mandya": ["Mandya"],
    "Chitradurga": ["Chitradurga"],
    "Ramanagara": ["Ramanagara", "Ramanagar"],
    "Bagalkot": ["Bagalkot"],
    "Vijayapura": ["Vijayapura", "Bijapur"],
    "Kodagu": ["Kodagu", "Coorg"],
    "Udupi": ["Udupi", "Manipal"],
    "Chikkamagaluru": ["Chikkamagaluru", "Chikmagalur"],
    "Bidar": ["Bidar"],
    "Gadag": ["Gadag"],
    "Haveri": ["Haveri"],
    "Koppal": ["Koppal"],
    "Yadgir": ["Yadgir"],
    "Chamarajanagar": ["Chamarajanagar"],
    "Chikkaballapur": ["Chikkaballapur", "Chikballapur"],
    "Kolar": ["Kolar"],
}

# 24 Categories in 2022-2024
CATEGORIES_OLD = ["1G", "1K", "1R", "2AG", "2AK", "2AR", "2BG", "2BK", "2BR",
                   "3AG", "3AK", "3AR", "3BG", "3BK", "3BR", "GM", "GMK", "GMR",
                   "SCG", "SCK", "SCR", "STG", "STK", "STR"]

# 28 Categories in 2025
CATEGORIES_NEW = ["1G", "1K", "1R", "2AG", "2AK", "2AR", "2BG", "2BK", "2BR",
                   "3AG", "3AK", "3AR", "3BG", "3BK", "3BR", "GM", "GMK", "GMP",
                   "GMR", "NRI", "OPN", "OTH", "SCG", "SCK", "SCR", "STG", "STK", "STR"]

def extract_city(college_name):
    for city, keywords in CITY_KEYWORDS.items():
        for keyword in keywords:
            if keyword.lower() in college_name.lower():
                return city
    return "Other"

def clean_college_name(name):
    name = re.sub(r'\s*\(.*?\)\s*', ' ', name)
    name = re.sub(r'\s+', ' ', name).strip()
    return name.strip()

def parse_cutoff_value(val):
    if val is None or val.strip() == '--' or val.strip() == '':
        return None
    try:
        val = val.strip().replace(',', '')
        return float(val) if '.' in val else int(val)
    except (ValueError, AttributeError):
        return None

def parse_format_a_tables(pdf_path, year, round_num):
    records = []
    pdf = pdfplumber.open(pdf_path)

    current_college_code = None
    current_college_name = None
    current_city = None

    for page_idx, page in enumerate(pdf.pages):
        text = page.extract_text()
        if not text:
            continue

        lines = text.split('\n')
        college_headers = []
        for line in lines:
            college_match = re.match(r'^(\d+)\s+(E\d{3})\s+(.+?)$', line.strip())
            if college_match:
                college_headers.append({
                    'code': college_match.group(2),
                    'name': clean_college_name(college_match.group(3)),
                    'city': extract_city(college_match.group(3))
                })

        tables = page.extract_tables()
        header_idx = 0
        
        for table in tables:
            if not table or len(table) < 2:
                continue

            header_row = table[0]
            if header_row and header_row[0] is None and len(header_row) >= 20:
                if header_idx < len(college_headers):
                    current_college_code = college_headers[header_idx]['code']
                    current_college_name = college_headers[header_idx]['name']
                    current_city = college_headers[header_idx]['city']
                    header_idx += 1
                elif current_college_code is None:
                    continue

                categories = [h.strip() if h else '' for h in header_row[1:]]
                
                # Check category list to match
                if 'GMP' in categories:
                    expected_categories = CATEGORIES_NEW
                else:
                    expected_categories = CATEGORIES_OLD

                for row in table[1:]:
                    if not row or not row[0]:
                        continue

                    branch_cell = row[0].strip()
                    bc_match = re.match(r'^([A-Z]{2,3})\s*(.*)', branch_cell.replace('\n', ' '))
                    if not bc_match:
                        continue

                    branch_code = bc_match.group(1)
                    branch_name_part = bc_match.group(2).strip()

                    values = row[1:]
                    cutoffs = {}
                    # Use extracted categories or fallback to expected
                    use_categories = categories if len(categories) >= 20 else expected_categories
                    
                    for i, cat in enumerate(use_categories):
                        if i < len(values) and cat:
                            val = parse_cutoff_value(values[i] if values[i] else '--')
                            if val is not None:
                                cutoffs[cat] = val

                    if cutoffs:
                        full_branch_name = BRANCH_MAP.get(branch_code, branch_name_part)
                        records.append({
                            "year": year,
                            "round": round_num,
                            "collegeCode": current_college_code,
                            "collegeName": current_college_name,
                            "city": current_city,
                            "branchCode": branch_code,
                            "branchName": full_branch_name,
                            "cutoffs": cutoffs
                        })

    pdf.close()
    return records

def parse_format_b(pdf_path, year, round_num):
    records = []
    pdf = pdfplumber.open(pdf_path)

    current_college_code = None
    current_college_name = None
    current_city = None
    categories = None

    for page_idx, page in enumerate(pdf.pages):
        text = page.extract_text()
        if not text:
            continue

        lines = text.split('\n')
        for line in lines:
            line = line.strip()
            if not line:
                continue

            if 'KARNATAKA EXAMINATIONS' in line or 'Non-Interactive' in line or 'UGCET-' in line or 'Seat Type:' in line:
                continue

            college_match = re.match(r'^College:\s*(E\d{3})\s+(.+?)$', line)
            if college_match:
                current_college_code = college_match.group(1)
                full_name = college_match.group(2)
                current_city = extract_city(full_name)
                current_college_name = clean_college_name(full_name)
                continue

            if line.startswith('Course Name'):
                cats = line.replace('Course Name', '').strip().split()
                if len(cats) >= 20:
                    categories = cats
                continue

            if current_college_code and categories:
                tokens = line.split()
                if not tokens:
                    continue

                num_start = -1
                for i, token in enumerate(tokens):
                    cleaned = token.replace('.', '').replace(',', '')
                    if re.match(r'^\d+$', cleaned) or token == '--':
                        num_start = i
                        break

                if num_start <= 0:
                    continue

                branch_name = ' '.join(tokens[:num_start]).strip()
                values = tokens[num_start:]

                if len(values) < 15:
                    continue

                branch_code = None
                branch_name_upper = branch_name.upper()

                branch_name_to_code = {
                    "COMPUTER SCIENCE AND ENGINEERING": "CS",
                    "COMPUTER SCIENCE": "CS",
                    "COMPUTER": "CS",
                    "INFORMATION SCIENCE AND ENGINEERING": "IE",
                    "INFORMATION SCIENCE": "IE",
                    "INFORMATION": "IE",
                    "ELECTRONICS AND COMMUNICATION": "EC",
                    "ELECTRONICS AND COMMUNICATIO": "EC",
                    "ELECTRONICS AND": "EC",
                    "ELECTRONICS &": "EC",
                    "ELECTRICAL & ELECTRONICS": "EE",
                    "ELECTRICAL &": "EE",
                    "ELECTRICAL": "EE",
                    "MECHANICAL ENGINEERING": "ME",
                    "MECHANICAL": "ME",
                    "CIVIL ENGINEERING": "CE",
                    "CIVIL": "CE",
                    "ARTIFICIAL INTELLIGENCE AND DATA SCIENCE": "AD",
                    "ARTIFICIAL INTELLIGENCE AND": "AD",
                    "ARTIFICIAL INTELLIGENCE": "AI",
                    "ARTIFICIAL": "AI",
                    "COMPUTER SCIENCE (ARTIFICIAL INTELLIGENCE AND MACHINE LEARNING)": "CA",
                    "COMPUTER SCIENCE (ARTIFICIAL": "CA",
                    "CS (AI, MACHINE LEARNING)": "CA",
                    "CS (AI,": "CA",
                    "AERO SPACE ENGINEERING": "SE",
                    "AERO SPACE": "SE",
                    "AEROSPACE": "SE",
                    "BIO TECHNOLOGY": "BT",
                    "BIO-TECHNOLOGY": "BT",
                    "BIO- TECHNOLOGY": "BT",
                    "BIOTECHNOLOGY": "BT",
                    "BIO": "BT",
                    "CHEMICAL ENGINEERING": "CH",
                    "CHEMICAL": "CH",
                    "INDUSTRIAL ENGINEERING": "IM",
                    "INDUSTRIAL": "IM",
                    "AUTOMOBILE ENGINEERING": "AU",
                    "AUTOMOBILE": "AU",
                    "MEDICAL ELECTRONICS": "MD",
                    "MEDICAL": "MD",
                    "TEXTILE TECHNOLOGY": "TX",
                    "TEXTILE": "TX",
                    "SILK TECHNOLOGY": "ST",
                    "SILK": "ST",
                    "ELECTRONICS AND INSTRUMENTATION": "EI",
                    "ELECTRONICS & INSTRUMENTATION": "EI",
                    "ELECTRONICS AND TELECOMMUNICATION": "ET",
                    "ELECTRONICS & TELECOMMUNICATION": "ET",
                    "MECHATRONICS": "MR",
                    "MINING ENGINEERING": "MI",
                    "MINING": "MI",
                    "ROBOTICS": "RI",
                    "POLYMER": "PT",
                    "DATA SCIENCE": "DS",
                    "DATA": "DS",
                    "COMPUTER SCIENCE & ENGINEERING": "CS",
                    "ENVIRONMENTAL": "EN",
                    "CYBER": "CY",
                    "AERONAUTICAL": "AE",
                    "AGRICULTURAL": "AG",
                }

                for key, code in branch_name_to_code.items():
                    if branch_name_upper.startswith(key):
                        branch_code = code
                        break

                if not branch_code:
                    for key, code in branch_name_to_code.items():
                        if key in branch_name_upper:
                            branch_code = code
                            break

                if not branch_code:
                    branch_code = branch_name[:2].upper()

                cutoffs = {}
                for i, cat in enumerate(categories):
                    if i < len(values):
                        val = parse_cutoff_value(values[i])
                        if val is not None:
                            cutoffs[cat] = val

                if cutoffs:
                    full_branch_name = BRANCH_MAP.get(branch_code, branch_name.title())
                    records.append({
                        "year": year,
                        "round": round_num,
                        "collegeCode": current_college_code,
                        "collegeName": current_college_name,
                        "city": current_city,
                        "branchCode": branch_code,
                        "branchName": full_branch_name,
                        "cutoffs": cutoffs
                    })

    pdf.close()
    return records

def merge_and_deduplicate(all_records):
    seen = set()
    unique = []
    for r in all_records:
        key = (r['year'], r['round'], r['collegeCode'], r['branchCode'])
        if key not in seen:
            seen.add(key)
            unique.append(r)
    return unique

def main():
    data_dir = os.path.join(os.path.dirname(__file__), 'updated raw data')
    output_dir = os.path.join(os.path.dirname(__file__), 'public', 'data')
    os.makedirs(output_dir, exist_ok=True)

    all_records = []

    pdf_files = [
        ("engg_cutoff_gen.pdf", 2022, 1, "A"),
        ("engg_cutoff_gen (1).pdf", 2022, 2, "A"),
        ("engg_cutoff_gen (2).pdf", 2022, 3, "A"),
        ("ENGG_CUTOFF_2023english.pdf", 2023, 1, "A"),
        ("ENGG_CUTOFF_2023_R2english.pdf", 2023, 2, "A"),
        ("ENR2_CUTGENenglish.pdf", 2023, 3, "A"),
        ("ENGG_CUTOFF_2024_GEN_R1english.pdf", 2024, 1, "A"),
        ("ENGG_CUTOFF_2024_GEN_R2_FIN.pdf", 2024, 2, "A"),
        ("ENGG_CUTOFF_2024_GEN_EXT_RNDenglish.pdf", 2024, 3, "A"),
        ("PROF_CODE_E_R_R1english.pdf", 2025, 1, "B"),
        ("PROF_CODE_E_R_30082025english.pdf", 2025, 2, "B"),
        ("PROF_CODE_E_R_11092025english.pdf", 2025, 3, "B"),
    ]

    for filename, year, round_num, fmt in pdf_files:
        filepath = os.path.join(data_dir, filename)
        if not os.path.exists(filepath):
            print(f"WARNING: File not found: {filepath}")
            continue

        print(f"Processing: {filename} (Year: {year}, Round: {round_num}, Format: {fmt})")
        if fmt == "A":
            records = parse_format_a_tables(filepath, year, round_num)
        else:
            records = parse_format_b(filepath, year, round_num)

        print(f"  Extracted {len(records)} records")
        all_records.extend(records)

    all_records = merge_and_deduplicate(all_records)
    print(f"\nTotal unique records: {len(all_records)}")

    years = set(r['year'] for r in all_records)
    print(f"Years: {sorted(years)}")

    output_path = os.path.join(output_dir, 'all_cutoffs.json')
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(all_records, f, indent=2, ensure_ascii=False)

    print(f"\nOutput written to: {output_path}")

if __name__ == '__main__':
    main()

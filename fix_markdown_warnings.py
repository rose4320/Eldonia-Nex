#!/usr/bin/env python3
"""
MDファイルの警告を修正するスクリプト
主に見出し、リスト、コードブロック周りの空白行を自動で追加
"""
import re
import sys
from typing import List


def fix_markdown_warnings(content_text: str) -> str:
    """MDファイルの各種警告を修正"""
    lines = content_text.split('\n')
    fixed_lines: List[str] = []
    
    for i, line in enumerate(lines):
        # 現在行を追加
        fixed_lines.append(line)
        
        # 次の行があるかチェック
        if i + 1 < len(lines):
            next_line = lines[i + 1]
            
            # MD022: 見出しの下に空白行がない場合
            if (re.match(r'^#{1,6}\s', line) and 
                next_line.strip() != '' and 
                not re.match(r'^#{1,6}\s', next_line) and
                not next_line.startswith('```')):
                fixed_lines.append('')
            
            # MD032: リストの後に空白行がない場合
            if (re.match(r'^\s*[-*+]\s', line) and
                next_line.strip() != '' and
                not re.match(r'^\s*[-*+]\s', next_line) and
                not re.match(r'^#{1,6}\s', next_line)):
                # 次の行が見出し、リスト、またはコードブロックでない場合
                if not next_line.startswith('```') and not next_line.startswith('````'):
                    fixed_lines.append('')
            
            # MD031: コードブロックの後に空白行がない場合
            if (line.startswith('```') and not line.startswith('````') and
                len(line.strip()) == 3 and  # 終了の```のみの行
                next_line.strip() != '' and
                not re.match(r'^#{1,6}\s', next_line)):
                fixed_lines.append('')
    
    return '\n'.join(fixed_lines)

def fix_heading_spacing(content_text: str) -> str:
    """見出しの前後の空白行を修正（MD022対応）"""
    lines = content_text.split('\n')
    fixed_lines: List[str] = []
    
    for i, line in enumerate(lines):
        # 見出しの前に空白行を追加（ファイルの最初以外）
        if (re.match(r'^#{1,6}\s', line) and i > 0 and
            lines[i-1].strip() != '' and
            not re.match(r'^#{1,6}\s', lines[i-1])):
            fixed_lines.append('')
        
        fixed_lines.append(line)
    
    return '\n'.join(fixed_lines)

def fix_code_block_spacing(content_text: str) -> str:
    """コードブロックの前後の空白行を修正（MD031対応）"""
    lines = content_text.split('\n')
    fixed_lines: List[str] = []
    
    for i, line in enumerate(lines):
        # コードブロック開始の前に空白行を追加
        if (line.startswith('```') and i > 0 and
            lines[i-1].strip() != '' and
            not re.match(r'^#{1,6}\s', lines[i-1])):
            fixed_lines.append('')
        
        fixed_lines.append(line)
        
        # コードブロック終了の後に空白行を追加
        if (line.strip() == '```' and i + 1 < len(lines) and
            lines[i+1].strip() != '' and
            not re.match(r'^#{1,6}\s', lines[i+1])):
            fixed_lines.append('')
    
    return '\n'.join(fixed_lines)

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("使用方法: python fix_markdown_warnings.py <filepath>")
        sys.exit(1)
    
    filepath = sys.argv[1]
    
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # 各種修正を適用
        content = fix_heading_spacing(content)
        content = fix_code_block_spacing(content)
        content = fix_markdown_warnings(content)
        
        # 修正したファイルを書き出し
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        
        print(f"✅ {filepath} の警告を修正しました")
        
    except (FileNotFoundError, IOError, UnicodeDecodeError, MemoryError) as e:
        print(f"❌ ファイル処理エラー: {e}")
        sys.exit(1)
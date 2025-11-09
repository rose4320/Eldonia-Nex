#!/usr/bin/env python3
"""
特定パターンのMarkdown警告を修正するスクリプト
"""
import re
import sys
from typing import List


def fix_specific_patterns(content_text: str) -> str:
    """特定のパターンの警告を修正"""
    lines = content_text.split('\n')
    fixed_lines: List[str] = []
    
    for i, line in enumerate(lines):
        fixed_lines.append(line)
        
        # 見出しの下にコードブロック（````）がある場合に空白行を追加
        if (re.match(r'^#{1,6}\s', line) and 
            i + 1 < len(lines) and 
            lines[i + 1].startswith('````')):
            fixed_lines.append('')
        
        # ````の直後に```がある場合に空白行を追加
        if (line.startswith('````') and
            i + 1 < len(lines) and 
            lines[i + 1].startswith('```') and
            not lines[i + 1].startswith('````')):
            fixed_lines.append('')
    
    return '\n'.join(fixed_lines)

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("使用方法: python fix_specific_patterns.py <filepath>")
        sys.exit(1)
    
    filepath = sys.argv[1]
    
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # 修正を適用
        content = fix_specific_patterns(content)
        
        # 修正したファイルを書き出し
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        
        print(f"✅ {filepath} の特定パターンを修正しました")
        
    except (FileNotFoundError, IOError, UnicodeDecodeError, PermissionError) as e:
        print(f"❌ ファイル処理エラー: {e}")
        sys.exit(1)
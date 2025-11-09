#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
完全なMarkdown警告修正スクリプト
すべてのMarkdownリントエラーを修正します
"""

import re
import sys
from pathlib import Path


def fix_markdown_warnings(file_path: Path) -> None:
    """Markdownファイルの警告を修正"""
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # バックアップ作成
    backup_path = file_path.with_suffix('.md.bak')
    with open(backup_path, 'w', encoding='utf-8') as f:
        f.write(content)
    
    # 1. MD022: ヘッダーの周りに空行を追加
    content = re.sub(r'(?<!^)\n(#{1,6} .*)\n(?!\n)', r'\n\n\1\n\n', content, flags=re.MULTILINE)
    content = re.sub(r'^(#{1,6} .*)\n(?!\n)', r'\1\n\n', content, flags=re.MULTILINE)
    
    # 2. MD031: コードフェンスの周りに空行を追加
    content = re.sub(r'(?<!^)\n```', r'\n\n```', content, flags=re.MULTILINE)
    content = re.sub(r'^```', r'\n```', content, flags=re.MULTILINE)
    content = re.sub(r'```\n(?!\n)', r'```\n\n', content)
    
    # 3. MD032: リストの周りに空行を追加
    content = re.sub(r'(?<!^)\n(- .*)', r'\n\n\1', content, flags=re.MULTILINE)
    content = re.sub(r'(- .*)\n(?![-\s])', r'\1\n\n', content, flags=re.MULTILINE)
    
    # 4. MD034: Bare URLをリンク形式に変換
    url_pattern = r'(?<![\[\(])http[s]?://[^\s\)]+(?![\]\)])'
    content = re.sub(url_pattern, r'<\g<0>>', content)
    
    # 5. MD040: コードブロックに言語指定を追加
    content = re.sub(r'```\n(?![a-zA-Z])', r'```text\n', content)
    
    # 6. MD025: 複数のH1ヘッダーを修正
    h1_count = content.count('\n# ')
    if content.startswith('# '):
        h1_count += 1
    
    if h1_count > 1:
        # 最初のH1以外をH2に変更
        first_h1 = True
        lines = content.split('\n')
        for i, line in enumerate(lines):
            if line.startswith('# ') and line.count('#') == 1:
                if first_h1:
                    first_h1 = False
                else:
                    lines[i] = '##' + line[1:]
        content = '\n'.join(lines)
    
    # 7. MD036: 強調をヘッダーに変更
    content = re.sub(r'^\*\*(.*)\*\*$', r'## \1', content, flags=re.MULTILINE)
    
    # 8. 重複する空行を削除
    content = re.sub(r'\n\n\n+', '\n\n', content)
    
    # 9. ファイル末尾に改行を追加（MD047）
    if not content.endswith('\n'):
        content += '\n'
    
    # 10. 余分な空白行を削除
    content = re.sub(r'[ \t]+$', '', content, flags=re.MULTILINE)
    
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print(f"✅ {file_path} の警告を修正しました")

def main() -> None:
    if len(sys.argv) != 2:
        print("使用法: python fix_all_markdown_warnings.py <ファイルパス>")
        sys.exit(1)
    
    file_path = Path(sys.argv[1])
    if not file_path.exists():
        print(f"❌ ファイルが見つかりません: {file_path}")
        sys.exit(1)
    
    if not file_path.suffix == '.md':
        print(f"❌ Markdownファイルではありません: {file_path}")
        sys.exit(1)
    
    try:
        fix_markdown_warnings(file_path)
    except (FileNotFoundError, IOError, UnicodeDecodeError, PermissionError, MemoryError) as e:
        print(f"❌ ファイル処理エラー: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
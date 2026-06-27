/* global React, ReactDOM */

function App() {
  return (
    React.createElement(React.Fragment, null,
        React.createElement('header', { className: 'header' },
        React.createElement('div', { className: 'logo' }, [
          React.createElement('img', { src: 'logo.png', alt: 'Eldonia NEX logo', className: 'logoImg', key: 'img' }),
          React.createElement('span', { className: 'logoText', key: 'text' }, 'Eldonia NEX')
        ]),
        React.createElement('nav', { className: 'nav' },
          React.createElement('a', { href: '#quest' }, 'Quest'),
          React.createElement('a', { href: '#gallery' }, 'Gallery'),
          React.createElement('a', { href: '#shop' }, 'Shop'),
          React.createElement('a', { href: '#events' }, 'Events'),
          React.createElement('a', { href: '#community' }, 'Community'),
          React.createElement('a', { href: '#works' }, 'Works')
        ),
        React.createElement('div', { className: 'authLinks' },
          React.createElement('a', { href: '#login' }, 'ログイン'),
          React.createElement('a', { href: '#signup', className: 'signupButton' }, '新規登録')
        )
      ),
      React.createElement('main', { className: 'main' },
        // Hero section
        React.createElement('section', { className: 'hero' },
          React.createElement('div', { className: 'heroText' },
            React.createElement('h1', { className: 'heroTitle' }, 'Quest. Create. Earn.'),
            React.createElement('p', { className: 'heroSubtitle' }, 'クエストでスキルを磨き、作品を発表し、報酬を獲得する。あなたのクリエイティブな旅がここから始まります。'),
            React.createElement('div', { className: 'heroButtons' },
              React.createElement('a', { href: '#signup', className: 'primaryButton' }, '無料で始める'),
              React.createElement('a', { href: '#quest', className: 'secondaryButton' }, 'Questを探す')
            ),
            React.createElement('div', { className: 'stats' },
              React.createElement('div', null,
                React.createElement('strong', null, '12,458'),
                React.createElement('span', null, 'クリエイター')
              ),
              React.createElement('div', null,
                React.createElement('strong', null, '3,215'),
                React.createElement('span', null, '公開中のQuest')
              ),
              React.createElement('div', null,
                React.createElement('strong', null, '¥38,932,100'),
                React.createElement('span', null, '累計報酬')
              )
            )
          ),
          React.createElement('div', { className: 'heroInfo' },
            React.createElement('h2', null, 'Questとは？'),
            React.createElement('p', null, 'クリエイターとファンが共創できるアクティビティです。お題をクリアすることで報酬が手に入り、スキルアップにも繋がります。')
          )
        ),
        // Modules section
        React.createElement('section', { className: 'modules', id: 'modules' },
          React.createElement('h2', null, 'クリエイター向けモジュール'),
          React.createElement('div', { className: 'moduleGrid' },
            ['Quest', 'Gallery', 'Shop', 'Events', 'Community', 'Works'].map(function(name, index) {
              var descriptions = [
                'クエストに挑戦しスキルアップ。',
                '作品を投稿して評価を得よう。',
                'グッズや作品を販売。',
                'イベントを開催してファンと交流。',
                '翻訳付きチャットや掲示板でコミュニティを運営。',
                '求人・業務マッチングで新しい機会を。'
              ];
              var links = ['探す →', '投稿する →', '出店する →', '開催する →', '参加する →', '応募する →'];
              var ids = ['quest','gallery','shop','events','community','works'];
              return React.createElement('div', { className: 'moduleCard', key: index, id: ids[index] },
                React.createElement('h3', null, name),
                React.createElement('p', null, descriptions[index]),
                React.createElement('a', { href: '#' + ids[index] }, links[index])
              );
            })
          )
        ),
        // Investor section
        React.createElement('section', { className: 'investorSection', id: 'investors' },
          React.createElement('div', { className: 'investorText' },
            React.createElement('h2', null, '未来を共に創る、初期投資家・協力者を募集'),
            React.createElement('p', null, 'Eldonia NEXではプロジェクトの成長を支えてくださる投資家や協力者を募集中です。限定コミュニティへの招待や特別なリターンをご用意しています。'),
            React.createElement('ul', null,
              React.createElement('li', null, 'プロジェクトの発展に参加'),
              React.createElement('li', null, '限定コミュニティへ招待'),
              React.createElement('li', null, '特別なリターンや体験')
            ),
            React.createElement('a', { href: '#contact', className: 'primaryButton' }, 'お問い合わせ')
          ),
          React.createElement('div', { className: 'investorBadge' },
            React.createElement('div', { className: 'badgeImage' }),
            React.createElement('p', null, 'シリアルナンバー：YY-CC-NNNN'),
            React.createElement('p', null, 'YY:発行年度  CC:カテゴリ  NNNN:発行番号'),
            React.createElement('ul', { className: 'badgeCategories' },
              React.createElement('li', null, '01 Investor'),
              React.createElement('li', null, '02 Partner'),
              React.createElement('li', null, '03 Advisor'),
              React.createElement('li', null, '04 Media'),
              React.createElement('li', null, '05 Community')
            )
          )
        )
      ),
      React.createElement('footer', { className: 'footer' },
        React.createElement('p', null, '© 2026 Eldonia NEX. All rights reserved.')
      )
    )
  );
}

document.addEventListener('DOMContentLoaded', function() {
  ReactDOM.render(React.createElement(App), document.getElementById('root'));
});
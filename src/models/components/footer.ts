import Component from '../templates/components';

class Footer extends Component {
  constructor(className: string) {
    super(className);
  }

  renderFooter() {
    const githubBlock = document.createElement('div');
    githubBlock.className = 'footer__github';

    const link1 = document.createElement('a');
    link1.className = 'footer__github-link';
    link1.href = 'https://github.com/shipu4ka';
    link1.textContent = 'shipu4ka';

    const link2 = document.createElement('a');
    link2.className = 'footer__github-link';
    link2.href = 'https://github.com/Elena-MyOne';
    link2.textContent = 'Elena-MyOne';

    githubBlock.append(...[link1, link2]);

    const date = document.createElement('time');
    date.className = 'footer__date';
    date.innerText = '2023';

    const rssLink = document.createElement('a');
    rssLink.className = 'footer__rss-link';
    rssLink.href = 'https://rs.school/js/';

        const rssImage = document.createElement('img');
        rssImage.className = 'footer__rss-img';
        rssImage.src = '../assets/icons/rslogo-w.svg';
        rssImage.alt = 'RSS logo';

    rssLink.append(rssImage);

    this.element.append(...[githubBlock, date, rssLink]);
  }

  render() {
    this.renderFooter();
    return this.element;
  }
}
export default Footer;

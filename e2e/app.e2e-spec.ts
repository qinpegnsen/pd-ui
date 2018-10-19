import { MyWapPage } from './app.po';

describe('my-wap App', () => {
  let page: MyWapPage;

  beforeEach(() => {
    page = new MyWapPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});

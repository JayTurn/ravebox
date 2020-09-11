/**
 * index.d.ts
 * Custom type declarations.
 */

declare module "*.svg" {
  export default any;
}

declare module "*.ttf" {
  export default any;
}

/**
 * Overrides for react-share incorrect type handling.
 */
declare module 'react-share' {
  declare const EmailIcon: any;
  declare const EmailShareButton: any;
  declare const FacebookIcon: any;
  declare const FacebookShareButton: any;
  declare const LinkedinIcon: any;
  declare const LinkedinShareButton: any;
  declare const RedditIcon: any;
  declare const RedditShareButton: any;
  declare const TelegramIcon: any;
  declare const TelegramShareButton: any;
  declare const TumblrIcon: any;
  declare const TumblrShareButton: any;
  declare const TwitterIcon: any;
  declare const TwitterShareButton: any;
  declare const WeiboIcon: any;
  declare const WeiboShareButton: any;
  declare const WhatsappIcon: any;
  declare const WhatsappShareButton: any;

  export {
    EmailIcon,
    EmailShareButton,
    FacebookIcon,
    FacebookShareButton,
    LinkedinIcon,
    LinkedinShareButton,
    RedditIcon,
    RedditShareButton,
    TelegramIcon,
    TelegramShareButton,
    TumblrIcon,
    TumblrShareButton,
    TwitterIcon,
    TwitterShareButton,
    WeiboIcon,
    WeiboShareButton,
    WhatsappIcon,
    WhatsappShareButton
  }
}

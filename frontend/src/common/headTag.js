import {Helmet} from "react-helmet";

const HeadTag = ({ title }) => (
  <Helmet>
    <title>{title || 'Welcome to Heritage'}</title>
    <meta name="viewport" content="initial-scale=1.0, width=device-width" />
    <link rel="icon" type="image/svg" href="/logo.svg" />
  </Helmet>
);

export default HeadTag;

import { useLazyQuery } from "@apollo/client";
import createCache from "@emotion/cache";
import { CacheProvider } from "@emotion/react";
import { ThemeProvider as MuiThemeProvider } from "@mui/material/styles";
import { QUERY_SEO } from "api/graphql/ad.graphql";
import routes from "app/routes";
import useTheme from "hooks/useTheme";
import { useEffect, useState } from "react";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { useLocation, useRoutes } from "react-router-dom";
import createTheme from "theme";
import { getRouteName } from "utils/url.util";

const emotionCache = createCache({ key: "css" });

function App() {
  const content = useRoutes(routes);
  const { theme } = useTheme();

  const location = useLocation();
  const currentURL = location.pathname;
  const routeName = getRouteName(currentURL);

  const [title, setTitle] = useState("");
  const [canonicalUrl, setCanonicalUrl] = useState<string>(
    window.location.href,
  );
  const [SEOData, setSEOData] = useState<any[]>([]);
  const [getSEO] = useLazyQuery(QUERY_SEO, { fetchPolicy: "no-cache" });

  const formattedData: any = SEOData?.map((item) => {
    return Object.entries(item).map(([key, value]) => {
      return {
        name: key,
        content: value,
      };
    });
  }).flat();

  useEffect(() => {
    if (SEOData) {
      if (setSEOData?.[0]?.url) {
        setCanonicalUrl(SEOData?.[0]?.url);
      }
    }
  }, [SEOData]);

  useEffect(() => {
    const handleQuerySEO = async () => {
      try {
        const res = await getSEO({
          variables: {
            where: {
              title: routeName,
            },
          },
        });

        if (res?.data?.getPublicSEO?.data) {
          setSEOData(res?.data?.getPublicSEO?.data);
          setTitle(res?.data?.getPublicSEO?.data?.[0]?.title);
        }
      } catch (error) {
        console.log(error);
      }
    };

    handleQuerySEO();
  }, [routeName, getSEO]);

  return (
    <CacheProvider value={emotionCache}>
      <HelmetProvider>
        <Helmet defaultTitle={title} meta={formattedData}>
          <meta name="robots" content={SEOData?.[0]?.indexing || "noindex"} />
          <meta name="title" content={SEOData?.[0]?.title} />
          {currentURL !== "/df/extend" && (
            <meta name="description" content={SEOData?.[0]?.description} />
          )}
          <meta name="keywords" content={SEOData?.[0]?.keywords} />
          <meta name="author" content={"vSHARE"} />
          <meta name="publisher" content={"vSHARE TECHNOLOGY"} />
          <link rel="canonical" href={canonicalUrl} />

          <meta property="og:title" content={SEOData?.[0]?.title} />
          <meta property="og:description" content={SEOData?.[0]?.description} />
          <meta property="og:url" content={canonicalUrl} />
          <meta property="og:type" content="website" />
          <meta name="twitter:title" content={SEOData?.[0]?.title} />
          <meta
            name="twitter:description"
            content={SEOData?.[0]?.description}
          />
          <meta name="twitter:url" content={canonicalUrl} />
          <script
            async
            src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7931814511159648"
            crossOrigin="anonymous"
          />
        </Helmet>
        <MuiThemeProvider theme={createTheme(theme)}>
          {content}
        </MuiThemeProvider>
      </HelmetProvider>
    </CacheProvider>
  );
}

export default App;

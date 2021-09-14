import React, { useState, useEffect } from "react";
import mockUser from "./mockData.js/mockUser";
import mockRepos from "./mockData.js/mockRepos";
import mockFollowers from "./mockData.js/mockFollowers";
import axios from "axios";

const rootUrl = "https://api.github.com";

function rateLimitUrl() {
  return rootUrl + "/rate_limit";
}

function userInfoUrl(user) {
  return rootUrl + "/users/" + user;
}

const GithubContext = React.createContext();

const GithubProvider = ({ children }) => {
  const [githubUser, setGithubUser] = useState(mockUser);
  const [repos, setRepos] = useState(mockRepos);
  const [followers, setFollowers] = useState(mockFollowers);
  const [limit, setLimit] = useState({ total: "?", remaining: "?" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({ show: false, msg: "" });

  const fetchUser = async (user) => {
    axios(userInfoUrl(user))
      .then(
        ({
          data: {
            login,
            followers_url,
            repos_url,
            avatar_url,
            html_url,
            name,
            company,
            blog,
            bio,
            location,
            twitter_username,
            followers,
            following,
            public_gists,
            public_repos,
          },
        }) => {
          setGithubUser({
            avatar_url,
            html_url,
            name,
            company,
            blog,
            bio,
            location,
            twitter_username,
            followers,
            following,
            public_gists,
            public_repos,
          });
          axios(`${repos_url}?per_page=100`)
            .then(({ data }) => {
              setRepos(data);
            })
            .catch((e) => {
              setError({ show: true, msg: e.message });
            });
          axios(`${followers_url}?per_page=100`)
            .then(({ data }) => {
              setFollowers(data);
            })
            .catch((e) => {
              setError({ show: true, msg: e.message });
            });
        }
      )
      .catch((e) => {
        setError({ show: true, msg: e.message });
      });
  };

  const fetchLimits = (url) => {
    axios(url)
      .then(
        ({
          data: {
            rate: { limit: total, remaining },
          },
        }) => {
          setLimit({ total, remaining });
        }
      )
      .catch((e) => {
        setError({ show: true, msg: e.message });
      });
  };

  useEffect(() => {
    fetchLimits(rateLimitUrl());
  }, []);

  return (
    <GithubContext.Provider
      value={{
        githubUser,
        repos,
        followers,
        limit,
        loading,
        error,
        loading,
        setLoading,
        fetchUser,
      }}
    >
      {children}
    </GithubContext.Provider>
  );
};

export { GithubProvider, GithubContext };

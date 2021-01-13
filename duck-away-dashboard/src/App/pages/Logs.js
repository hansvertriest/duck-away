import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { format } from 'date-fns';

import { StandardLayout } from '../layouts';

import { useApi } from '../services';

import * as Config from '../config';

export const Logs = () => {
  const history = useHistory();

  const { token, getLogs } = useApi();

  const [ logs, setLogs ] = useState([]);
  const [ canFetch, setCanFetch ] = useState(true);
  const [ currentPage, setCurrentPage ] = useState(1);

  const fetchData = async () => {
    const data = await getLogs(4, currentPage);

    if (data !== undefined) {
      setCurrentPage(currentPage + 1)
      setLogs([...logs, ...data.logs.docs]);
    };
  };

  useEffect(() => {
    if (token) {
      fetchData();
      registerInfiniteScroll('infinite-scroll');
    }
  }, [token]);

  // Infinite scrolling
  useEffect(() => {
      const func = async () => {
          await fetchData();
          setCanFetch(true)
      }

      if (!canFetch) func();
  }, [canFetch])

  const registerInfiniteScroll = async (id) => {
    const el = document.getElementById('infinite-scroll');
    window.addEventListener('scroll', async (e) => {
        checkOnBottom(e);
    })
  }

  const checkOnBottom = (e) => {
    const offset = 50;
    const isOnBottom = (window.innerHeight + window.scrollY) >= document.body.offsetHeight;
    if (isOnBottom && canFetch) {
        setCanFetch(false);
    }
  }

  return (
    <StandardLayout>
      <div className="container">
        <div className="row">
          <div className="col-12 d-flex justify-content-center">
            <span className="dashboard__options">
              <h3 className="dashboard__options--option" onClick={() => history.push('/')}>
                All checkpoints
                <span className="dashboard__options--option--border"></span>
              </h3>
              <h3 className="dashboard__options--option" onClick={() => history.push('/insights')}>
                All routes
                <span className="dashboard__options--option--border"></span>
              </h3>
              <h3 className="dashboard__options--option active-option">
                All logs
                <span className="dashboard__options--option--border"></span>
              </h3>
            </span>
          </div>
        </div>
        <div className="row d-flex justify-content-center dashboard__logs" id="infinite-scroll">
          {
            logs && logs.map((log, index) => {
              return (
                <div key={index} className="col-12 col-md-10">
                  <div className="dashboard__logs--log">
                    <div className="dashboard__logs--log--avatar">
                        <span>
                          <img src={`${Config.duckAwayConfig.apiUrl}picture/${log.duck.pictureName}`} alt="duck" />
                        </span>
                      </div>
                      <div className="dashboard__logs--log--date d-flex align-items-center">
                        <span>
                          <h3>
                            {log.duck.name}
                          </h3>
                          <p>
                            <strong>Scanned on:</strong> {format(new Date(log.createdAt), 'dd/MM/yyyy kk:mm:ss')}
                          </p>
                        </span>
                    </div>
                  </div>
                </div>
              )
            })
          }
        </div>
      </div>
    </StandardLayout>
  )
};

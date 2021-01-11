import React, { useCallback, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

import { StandardLayout } from "../layouts";
import { useApi } from "../services";

import * as Config from '../config';

import Check from '../assets/check.svg';

export const Checkpoints = () => {
  const history = useHistory();
  const { token, getCheckpoints } = useApi();

  const [ checkpoints, setCheckpoints ] = useState([]);
  const [ canFetch, setCanFetch ] = useState(true);
  const [ currentPage, setCurrentPage ] = useState(1);

  const fetchData = async () => {
    const data = await getCheckpoints(5, currentPage);

    if (data !== undefined) {
      console.log(data);
      setCurrentPage(currentPage + 1)
      setCheckpoints([...checkpoints, ...data.checkpoints.docs]);
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
              <h3 className="dashboard__options--option active-option">
                All checkpoints
                <span className="dashboard__options--option--border"></span>
              </h3>
              <h3 className="dashboard__options--option" onClick={() => history.push('/insights')}>
                All routes
                <span className="dashboard__options--option--border"></span>
              </h3>
            </span>
          </div>
        </div>
        <div className="row d-flex justify-content-center dashboard__checkpoints" id="infinite-scroll">
          {
            checkpoints && (
              checkpoints.map((innerElement, innerIndex) => {
                  return (
                    <div key={innerIndex} className="col-12 col-md-10">
                      <div className="dashboard__checkpoints--checkpoint">
                        <div className="dashboard__checkpoints--checkpoint--avatar">
                          <span>
                            <img src={`${Config.duckAwayConfig.apiUrl}picture/${innerElement.duck.pictureName}`} alt="duck" />
                            <p>
                              {innerElement.duck.name}
                            </p>
                          </span>
                        </div>
                        <div className="dashboard__checkpoints--checkpoint--position d-flex align-items-center">
                          <span>
                            <p>
                              <strong>Longitude:</strong> {innerElement.position.lon}
                            </p>
                            <p>
                              <strong>Latitude:</strong> {innerElement.position.lat}
                            </p>
                          </span>
                        </div>
                        <div className="dashboard__checkpoints--checkpoint--distance d-flex align-items-center">
                          <span>
                            <p>
                              <strong>Afstand van start</strong> {innerElement.duck.distanceFromStart.toFixed(2)}km
                            </p>
                            <p>
                              <strong>Afstand totaal</strong> {innerElement.duck.totalDistance.toFixed(2)}km
                            </p>
                          </span>
                        </div>
                        <div className="dashboard__checkpoints--checkpoint--image">
                          <img src={`${Config.duckAwayConfig.apiUrl}picture/${innerElement.pictureName}`} alt="subscription" />
                        </div>
                        {
                          !innerElement.approved && (
                            <div className="dashboard__checkpoints--checkpoint--approve" onClick={() => history.push(`${Config.duckAwayConfig.apiUrl}admin/approve/checkpoint/${innerElement._id}`)}>
                              <img src={Check} alt="check" />
                            </div>
                          )
                        }
                      </div>
                    </div>
                  )
                })
            )
          }
        </div>
      </div>
    </StandardLayout>
  )
};

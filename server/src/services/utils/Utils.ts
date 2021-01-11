import { default as nodemailer } from 'nodemailer';


import { IDuck } from "src/models";
import { IDuckPublic } from "src/models/types";
import { IMail } from "../config/config.types";

class Utils {
    static filterKeysAgainstModelKeys(changes: any, modelKeys: any) {
        const changesKeys = Object.keys(changes);
        const filteredKeys = changesKeys.filter((key) => !modelKeys.includes(key));

        // construct filteredChanges
        const filteredChanges: any = {};
        filteredKeys.forEach((key) => {
            filteredChanges[key] = changes[key];
        })

        return filteredChanges;
    }

    static castDuckToPublic(duck: IDuck): IDuckPublic {
        duck.checkPoints = undefined;
        duck.descriptionSubmissions = undefined;

        return duck
    }

    static sendMail(mailConfig: IMail, content: string, html: string, to: string) {
        const transporter = nodemailer.createTransport({
            host: 'smtp-auth.mailprotect.be',
            port: 465,
            secure: true,
            // service: mailConfig.service,
            auth: {
              user: mailConfig.user,
              pass: mailConfig.pass
            }
          });
          
          var mailOptions = {
            from:  mailConfig.user,
            to,
            subject: content,
            html
          };
          
          transporter.sendMail(mailOptions, function(error, info){
            if (error) {
              console.log(error);
            } else {
              console.log('Email sent: ' + info.response);
            }
          });
    }

    static calculateTotalDistanceOfPositionArray(startPosition: {lat: number, lon: number}, positions: {lat: number, lon: number}[]) {
        let totalDistance = 0;

        totalDistance += this.calcCrow(startPosition, positions[0])

        for (let pair = 0; pair < positions.length-1; pair++) {
          const pairDistance = this.calcCrow(positions[pair], positions[pair+1]);
          totalDistance += pairDistance;
        }

        return totalDistance;
    }

    static calculateDistanceFromHome(startPosition: {lat: number, lon: number}, latestPosition: {lat: number, lon: number}) {
      const distance = this.calcCrow(startPosition, latestPosition);
      return distance;
    }

    static calcCrow(position1: {lat: number, lon: number}, position2: {lat: number, lon: number}) {
        var R = 6371; // km

        let lat1 = position1.lat;
        let lon1 = position1.lon;
        let lat2 = position2.lat;
        let lon2 = position2.lon;

        var dLat = this.toRad(lat2-lat1);
        var dLon = this.toRad(lon2-lon1);
        lat1 = this.toRad(lat1);
        lat2 = this.toRad(lat2);

        var a = (Math.sin(dLat/2) * Math.sin(dLat/2)) + (Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2)); 
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
        var d = R * c;
        return d;
    }

    static toRad(value: number){
        return value * Math.PI / 180;
    }
}

export default Utils;
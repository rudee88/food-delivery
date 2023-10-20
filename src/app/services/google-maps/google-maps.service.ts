import { HttpClient } from '@angular/common/http';
import { Injectable, NgZone } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';
import { SearchPlace } from 'src/app/models/search-place.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class GoogleMapsService {
  googleMaps: any;
  private _places = new BehaviorSubject<SearchPlace[]>([]);

  get places() {
    return this._places.asObservable();
  }
 
  constructor(
    private http: HttpClient,
    private zone: NgZone
    ) {}

  loadGoogleMaps(): Promise<any> {
    const win = window as any;
    const gModule = win.google;
    if (gModule && gModule.maps) {
      return Promise.resolve(gModule.maps);
    }
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src =
        'https://maps.googleapis.com/maps/api/js?key=' +
        environment.googleMapsApikey +
        '&libraries=places';
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
      script.onload = () => {
        const loadedGoogleModule = win.google;
        if (loadedGoogleModule && loadedGoogleModule.maps) {
          resolve(loadedGoogleModule.maps);
        } else {
          reject('Google Map SDK is not Available');
        }
      };
    });
  }

  getAddress(lat: number, lng: number) {
    return new Promise((resolve, reject) => {
      this.http
        .get<any>(
          `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${environment.googleMapsApikey}`
        )
        .pipe(
          map(geoData => {
            if (!geoData || !geoData.results || geoData.results.length === 0) throw(null);
            console.log('result: ', geoData.results[0]);
            return geoData.results[0];
          })
        ).subscribe(data => {
          resolve(data);
        }, e => {
          reject(e);
        });
    });
  }

  async getPlaces(query) {
    try {
      if (!this.googleMaps) {
        this.googleMaps = await this.loadGoogleMaps()
      }
      let googleMaps: any = this.googleMaps;
      console.log('maps: ', this.googleMaps);
      let service = new googleMaps.places.AutocompleteService();
      service.getPlacePredictions({
        input: query,
        componentRestriction: {
          country: 'MY'
        }
      }, (predictions) => {
        let autoCompleteItems = [];
        this.zone.run(() => {
          if (predictions != null) {
            predictions.forEach(async (prediction) => {
              console.log('prediction: ', prediction);
              const latLng: any = await this.geoCode(prediction.description, googleMaps);
              const places: any = {
                location_name: prediction.structured_formatting.main_text,
                address: prediction.description,
                lat: latLng.lat,
                lng: latLng.lng
              };
              console.log('places: ', places);
              autoCompleteItems.push(places);
            });
            // rxjs behaviour subject
            this._places.next(autoCompleteItems);
          }
        });
      });
    } catch(e) {
      console.log(e);
    }
  }

  geoCode(address, googleMaps) {
    let latlng = {lat: '', lng: ''};
    return new Promise((resolve, reject) => {
      let geocoder = new googleMaps.Geocoder();
      geocoder.geocode({'address' : address}, (results) => {
        console.log('results: ', results);
        latlng.lat = results[0].geometry.location.lat();
        latlng.lng = results[0].geometry.location.lng();
        resolve(latlng);
      });
    });
  }

}

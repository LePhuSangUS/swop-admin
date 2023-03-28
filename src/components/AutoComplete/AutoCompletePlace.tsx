import { Ellipsis } from 'ant-design-pro';
import { Input } from 'antd';
import React from 'react';
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
  Suggestion,
} from 'react-places-autocomplete';
import { IFormProps, ISearchResponse } from 'types';
import styles from './AutoCompletePlace.less';

const { Search } = Input;
interface IProps extends IFormProps {
  placeholder?: string;
  onSelect: (result: ISearchResponse) => void;
  onError?: (error: any) => void;
  initialValue?: string;
  inputID: string;
}

interface IState {
  address: string;
}

class AutoCompletePlace extends React.Component<IProps, IState> {
  state: IState = {
    address: this.props.initialValue,
  };

  handleAddressChange = (address: string): void => {
    this.setState({ address });
  };

  handleAddressSelect = (address: string, placeID: string) => {
    const { onSelect, onError } = this.props;
    geocodeByAddress(address)
      .then(async (results: google.maps.GeocoderResult[]) => {
        const latLng = await getLatLng(results[0]);
        return {
          latLng,
          geo: results[0],
        };
      })
      .then(({ latLng, geo }) => {
        this.setState({ address });

        if (typeof onSelect === 'function') {
          const result: ISearchResponse = {
            address,
            google_place_id: placeID,
            lat: latLng.lat,
            lng: latLng.lng,
          };

          if (Array.isArray(geo?.address_components)) {
            geo?.address_components?.forEach((item) => {
              if (Array.isArray(item.types)) {
                if (item.types.includes('street_number')) {
                  result.number = item.long_name;
                } else if (item.types.includes('administrative_area_level_2')) {
                  result.district = item.long_name;
                } else if (item.types.includes('administrative_area_level_1')) {
                  result.city = item.long_name;
                } else if (item.types.includes('country')) {
                  result.country = item.long_name;
                  result.country_code = item.short_name;
                } else if (item.types.includes('route')) {
                  result.street = item.long_name;
                }
              }
            });
          }

          onSelect(result);
        }
      })
      .catch((error: any) => {
        if (typeof onError === 'function') {
          onError(error);
        }
      });
  };

  render() {
    const { address = '' } = this.state;
    const { inputID, placeholder = 'Search bar location' } = this.props;
    return (
      <PlacesAutocomplete
        onChange={this.handleAddressChange}
        onSelect={this.handleAddressSelect}
        value={address}
        debounce={300}
        searchOptions={{
          componentRestrictions: { country: ['vn'] },
          types: ['address'],
        }}
      >
        {({ getInputProps, getSuggestionItemProps, suggestions, loading }) => (
          <React.Fragment>
            <Search
              {...getInputProps({ id: inputID })}
              placeholder={placeholder}
              loading={loading}
              defaultValue={address}
              value={address}
              enterButton=""
            />
            <div className={styles.container}>
              {suggestions.map((suggestion: Suggestion) => {
                const className = suggestion.active ? 'suggestion-item--active' : 'suggestion-item';
                const style = suggestion.active
                  ? { backgroundColor: '#fafafa', cursor: 'pointer' }
                  : { backgroundColor: '#ffffff', cursor: 'pointer' };

                const spread: any = {
                  ...getSuggestionItemProps(suggestion, {
                    className,
                    style,
                  }),
                };

                return (
                  <div {...spread} key={suggestion.id}>
                    <Ellipsis>
                      <div className={styles.description}>{suggestion.description}</div>
                    </Ellipsis>
                  </div>
                );
              })}
            </div>
          </React.Fragment>
        )}
      </PlacesAutocomplete>
    );
  }
}

export default AutoCompletePlace;

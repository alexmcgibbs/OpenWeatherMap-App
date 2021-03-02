import '@testing-library/jest-dom';
import App from './App';
import { mount, configure } from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
configure({adapter: new Adapter()});


describe("App", () => {
 const app = mount(
    <App 
    countriesLoading={true} 
    citiesLoading={true} 
    selectedCountry="US" 
    selectedCity="Seattle" 
    test={true} />)

 it('useEffect fetches', (done) => {
	setTimeout(() => { 
  	  app.update()
  	  const countries = app.find('input#weather-autocomplete-country')
  	  const cities = app.find('input#weather-autocomplete-city')
  	  try {
        expect(cities.prop('disabled')).toEqual(false)
        expect(app.find('div#cards').length).toEqual(1)
	    done();
	  } catch (error) {
	    done(error);
	  }
	}, 3000)
  })

  it('reset city', (done) => {
  	const cities = app.find('input#weather-autocomplete-city')
  	cities.props().onChange({ target: { value: "" } })
	setTimeout(() => { 
  	  app.update()
  	  try {
        expect(app.find('div#cards').length).toEqual(0)
	    done();
	  } catch (error) {
	    done(error);
	  }
	}, 3000)
  })

  jest.setTimeout(10000)
  it('set city', (done) => {
 	const cities = app.find('input#weather-autocomplete-city')
    cities.props().onChange({ target: { value: "Bear Creek" } })
	setTimeout(() => { 
  	  app.update()
  	  try {
        expect(app.find('div#cards').length).toEqual(1)
	    done();
	  } catch (error) {
	    done(error);
	  }
	}, 5000)
  })

  it('reset country', (done) => {
  	const countries = app.find('input#weather-autocomplete-country')
  	countries.props().onChange({ target: { value: "" } })
	setTimeout(() => { 
  	  app.update()
  	  const cities = app.find('input#weather-autocomplete-city')
  	  try {
        expect(cities.prop('disabled')).toEqual(true)
	    done();
	  } catch (error) {
	    done(error);
	  }
	}, 3000)
  })

  it('set country', (done) => {
  	const countries = app.find('input#weather-autocomplete-country')
    countries.props().onChange({ target: { value: "US" } })
	setTimeout(() => { 
  	  app.update()
  	  const cities = app.find('input#weather-autocomplete-city')
  	  try {
        expect(cities.prop('disabled')).toEqual(false)
	    done();
	  } catch (error) {
	    done(error);
	  }
	}, 5000)
  })

});

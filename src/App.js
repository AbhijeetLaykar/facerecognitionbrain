import React, {Component} from 'react';
import './App.css';
import Navigation from './components/Navigation/Navigation';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Signin from './components/Signin/Signin';
import Register from './components/Register/Register';
import Rank from './components/Rank/Rank';
import Particles from 'react-particles-js';

// adding a comment for git testing

const particleOptions = {
      particles: {
        number: {
          value: 90,
          density :{
          enable: true,
          value_area: 450
          }
        }
      }
}

const initialState = {
      input: '',
      imageUrl: '',
      box: {
        // leftcol: 0,
        // topRow: 0,
        // rightCol: 0,
        // bottomRow: 0
      },
      route : 'signin',
      isSignedIn: false,
      user: {
        id: '',
        name: '',
        email: '',
        entries: 0,
        joined: '',
      }
}


class App extends Component {
  constructor() {
    super();
    this.state = initialState;
  }

loadUser = (data) => {
  this.setState( {user: {
        id: data.id,
        name: data.name,
        email: data.email,
        entries: data.entries,
        joined: data.joined,}
      })
}

calculateFaceLocation = (data) => {
  const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
  const image = document.getElementById('inputimage');
  const width = Number(image.width);
  const height = Number(image.height);
  return {
    leftcol: clarifaiFace.left_col * width,
    topRow: clarifaiFace.top_row * height,
    rightCol: width - (clarifaiFace.right_col * width),
    bottomRow: height - (clarifaiFace.bottom_row * height)
  }
}

displayFaceBox = (box) => {
  // console.log(box);
  this.setState({box: box});
  // console.log(box);
}

onInputChange = (event) => {
  // console.log(event.target.value);
  this.setState({input: event.target.value});
}

onButtonSubmit = () => {
  this.setState({imageUrl: this.state.input});
  fetch('http://localhost:3000/imageurl', {
          method: 'post',
          headers: {'content-type' : 'application/json'},
          body: JSON.stringify({
          input: this.state.input

        })
      })
    .then(response => response.json())
    .then(response =>  {
      if(response) {
        console.log('displaying image from clarify');
        fetch('http://localhost:3000/image', {
          method: 'put',
          headers: {'content-type' : 'application/json'},
          body: JSON.stringify({
            id: this.state.user.id,

          })
        })
        .then(response => response.json())
        .then(count =>{
          this.setState(Object.assign(this.state.user, { entries: count}))
        })
        .catch(err => {console.log(err, 'image error')})
      }

      this.displayFaceBox(this.calculateFaceLocation(response))


    })
    .catch(err => console.log(err, 'imageurl error'))  
}

onRouteChange = (route) => {
    if (route === 'signout') {
      this.setState(initialState); 
      // this.setState({imageUrl: ''});
      // this.setState({isSignedIn: false});
      // // this.setState({route: 'signin'});
      // // console.log(route, 'when signout');
    } else if (route === 'home') {
      this.setState({isSignedIn: true})
    } 

    if (route === 'signout') {
      this.setState({route: 'signin'})
    } else {
      this.setState({route : route});
    }
   
    // console.log(route, 'outside if');

}


  render() {
    const { isSignedIn, imageUrl, route, box } = this.state;
    return (
      <div className="App">
         <Particles className='particles'
            params={particleOptions} />
        <Navigation onRouteChange={this.onRouteChange} isSignedIn={isSignedIn}/>
        { route === 'home' 
            ? <div>
                  <Logo />
                  <Rank name={this.state.user.name} entries={this.state.user.entries}/>
                  <ImageLinkForm 
                    onInputChange={this.onInputChange}
                    onButtonSubmit={this.onButtonSubmit}
                  />
                  <FaceRecognition imageUrl={imageUrl} box={box}/>
              </div>
            : (
                route === 'signin' 
                ? <Signin loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
                : <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
              )
          }
    </div>
    );  
  }

}

export default App;

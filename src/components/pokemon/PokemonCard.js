import React, { Component } from 'react';
import styled from 'styled-components';
import spinner from '../pokemon/spinner.gif';

const Sprite = styled.img`
    width: 5em;
    height: 5em;
    display: none;
`;

const card = styled.div`
box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
`;

export default class PokemonCard extends Component {
state = {
    name: '',
    imageUrl: '',
    pokemonIndex: '',
    imageLoading: true,
    toManyRequests: false
};

componentDidMount(){
    const {name, url} = this.props;
    const pokemonIndex = url.split('/')[url.split('/').length - 2];
    const imageUrl = `https://github.com/PokeAPI/sprites/blob/master/sprites/pokemon/${pokemonIndex}.png?raw=true`;
    
    this.setState({
        name,
        imageUrl,
        pokemonIndex
    });
}

    render() {
        return (
            <div className = "col-md-3 col-sm-6 mb-5">
                <div className = "card">
                    <h5 className = "card-header">
                        {this.state.pokemonIndex}
                    </h5>

                    {this.state.imageLoading ? (
                        <img
                            src = {spinner}
                            style ={{width: '5em', height: '5em'}}
                            className = "card-img-top rounded mx-auto d-block mt-2"
                        />
                    ) : null}

                    <Sprite
                        className = "card-img-top rounded mx-auto mt-2"
                        onLoad = {() => this.setState({imageLoading: false})}
                        onError = {() => this.setState({toManyRequests: true})}
                        src = {this.state.imageUrl}
                        style = {
                            this.state.toManyRequests ? {display: "none"}:
                            this.state.imageLoading ? null : {display: "block"}
                        }
                    />

                    {this.state.toManyRequests ? (
                        <h6 className = "mx-auto">
                            <span className = "badge badge-danger mt-2">
                                To Many Request
                            </span>
                        </h6>
                    ) :null}

                    <div className = "card-body mx-auto">
                        <h6 className = "card-title">
                            {this.state.name
                                .toLowerCase()
                                .split(" ")
                                .map(
                                    letter => letter.charAt(0).toUpperCase() + letter.substring(1)
                                )
                                .join(' ')}
                        </h6>
                    </div>
                </div>
            </div>
        )
    }
}
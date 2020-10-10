import React, { Component } from 'react'
import axios from 'axios';

const TYPE_COLORS = {
    bug: 'B1C12E',
    dark: '4F3A2D',
    dragon: '755EDF',
    electric: 'FCBC17',
    fairy: 'F4B1F4',
    fighting: '823551D',
    fire: 'E73B0C',
    flying: 'A3B3F7',
    ghost: '6060B2',
    grass: '74C236',
    ground: 'D3B357',
    ice: 'A3E7FD',
    normal: 'C8C4BC',
    poison: '934594',
    psychic: 'ED4882',
    rock: 'B9A156',
    steel: 'B5B5C3',
    water: '3295F6'
};

export default class Pokemon extends Component {
    state = {
        name: '',
        pokemonIndex: '',
        imageUrl: '',
        types: [],
        description: '',
        stats: {
            hp: '',
            attack: '',
            defense: '',
            speed: '',
            specialAttack: '',
            specialDefense: ''
        },
        
        height: '',
        weight: '',
        eggGroup: '',
        abilities: '',
        genderRatioMale: '',
        genderRatioFemale: '',
        evs: '',
        hatchSteps: ''
    };

    async componentDidMount (){
        const { pokemonIndex } = this.props.match.params;
        
        // URL para informacion de pokemon
        const pokemonUrl = `https://pokeapi.co/api/v2/pokemon/${pokemonIndex}/`;
        const pokemonSpeciesUrl = `https://pokeapi.co/api/v2/pokemon-species/${pokemonIndex}/`;

        // obtener informacion de pokemon
        const pokemonRes = await axios.get(pokemonUrl);
        const name = pokemonRes.data.name;
        const imageUrl = pokemonRes.data.sprites.front_default;

        let {hp, attack, defense, speed, specialAttack, specialDefense} = ' ';

        pokemonRes.data.stats.map(stat => {
            switch (stat.stat.name) {
                case 'hp':
                    hp = stat['base_stat'];
                    break;
                
                case 'attack':
                    attack = stat['base_stat'];
                    break;
                
                case 'defense':
                    defense = stat['base_stat'];
                    break;

                case 'speed':
                    speed = stat['base_stat'];
                    break;

                case 'special-attack':
                    specialAttack = stat['base_stat'];
                    break;

                case ' special-defense':
                    specialDefense = stat['base_stat'];
                    break;
            }
        });

        // convertir decimetros a pies... el 0.0001 * 100)/100 es para aproximar a 2 decimales
        const height = 
            Math.round((pokemonRes.data.height * 0.328084 + 0.0001) * 100) / 100;
        
        // convertir a libras
        const weight =
            Math.round((pokemonRes.data.weight * 0.220462 + 0.0001) * 100) / 100;
        const types = pokemonRes.data.types.map(type => type.type.name);
        const abilities = pokemonRes.data.abilities.map(ability => {
            return ability.ability.name
                .toLowerCase()
                .split('-')
                .map(s => s.charAt(0).toUpperCase() +s.substring(1))
                .join(' ')
        });

        const evs = pokemonRes.data.stats.filter(stat => {
            if(stat.effort > 0){
                return true;
            }
            return false;
        })

        .map(stat => {
            return `${stat.effor} ${stat.stat.name}`
                .toLowerCase()
                .split('-')
                .map(s => s.charAt(0).toUpperCase() +s.substring(1))
                .join(' ')
        })
        .join(',');

        // obtener la descripcion de pokemon, tasa de captura, grupo de huevo, Proporcion de genero, pasos de eclosion.
        await axios.get(pokemonSpeciesUrl).then(res => {
            let description = '';
            res.data.flavor_text_entries.some(flavor => {
                if(flavor.language.name === 'en'){
                    description = flavor.flavor_text;
                    return;
                }
            });
        
        const femaleRate = res.data['gender_rate'];
        const genderRatioFemale = 12.5 * femaleRate;
        const genderRatioMale = 12.5 * (8 - femaleRate);
        const catchRate = Math.round((100/255) * res.data['capture_rate']);

        const eggGroups = res.data['egg_groups'].map(group => {
            return group.name
                .toLowerCase()
                .split(' ')
                .map(s => s.charAt(0).toUpperCase() + s.substring(1))
                .join(' ');
        })
        .join(',');
        
        const hatchSteps = 255* (res.data['hatch_counter'] + 1);
        this.setState([
            description,
            genderRatioFemale,
            genderRatioMale,
            catchRate,
            eggGroups,
            hatchSteps
        ]);
    });

    this.setState({
        imageUrl,
        pokemonIndex,
        name,
        types,
        state: {
            hp,
            attack,
            defense,
            speed,
            specialAttack,
            specialDefense
        },
        height,
        weight,
        abilities,
        evs
    });
}

    render() {
        return (
            <div className = "col">
                <div className = "card">
                    <div className = "card-header">
                        <div classname = "row">
                            <div className = "col-5">
                                <h5>{this.state.pokemonIndex}</h5>
                            </div>

                            <div className = "col-7">
                                <div className = "float-right">
                                    {this.state.types.map(type => (
                                        <span
                                            key = {type}
                                            classname = "badge badge-primary badge-pill mr-1"
                                            style = {{
                                                backgroundColor: `#${TYPE_COLORS[type]}`,
                                                color: 'white'
                                            }}
                                        >
                                            {type
                                                .toLowerCase()
                                                .split(' ')
                                                .map(s => s.charAt(0).toUpperCase() + s.substring(1))
                                                .join(' ')}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div classname = "card-body">
                        <div classname = "row align-items-center">
                            <div classname = "col-md-3">
                                <img
                                    src = {this.state.imageUrl}
                                    classname = "card-img-top rounded mx-auto mt-2"
                                />
                            </div>
                            <div className = "col-md-9">
                                <h4 className = "mx-auto">
                                    {this.state.name
                                        .toLowerCase()
                                        .split(' ')
                                        .map(s => s.charAt(0).toUpperCase() + s.substring(1))
                                        .join(' ')}
                                </h4>
                                <div className = "row align-items-center">
                                    <div className = "col-12 col-md-3">HP</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
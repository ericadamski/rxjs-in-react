import React, { Component } from "react";
import { Subject } from "rxjs"; // create
import { debounceTime, mergeMap } from "rxjs/operators"; // side effects
import styled, { injectGlobal } from "styled-components";

const EMOJIS_URI = "https://api.github.com/emojis";
//lol
function getEmojis() {
  return fetch(EMOJIS_URI).then(r => r.json());
}

class App extends Component {
  click$ = new Subject();

  state = {
    clicks: -0
  };

  componentDidMount() {
    this.click$
      .pipe(
        debounceTime(1000),
        mergeMap(() => getEmojis())
      )
      .subscribe({
        next: data => {
          alert(JSON.stringify(data));
          this.setState(({ clicks }) => ({ clicks: clicks + 1 }));
        }
      });
  }

  componentWillUnmount() {
    /**
     * Avoid Memory leaks by unsubscribing from the
     * event emitter
     */

    this.click$.unsubscribe();
  }

  handleClick(event) {
    /**
     * React Synthetic events
     * we want the event to live longer
     * than this function
     */
    event.persist();

    this.click$.next();

    // this.setState(({ clicks }) => ({ clicks: ++clicks }));
  }

  render() {
    return (
      <Container>
        <Links>
          <Link
            href="https://github.com/ericadamski/rxjs-in-react"
            target="blank"
            label="Code"
          >
            <ion-icon name="logo-github" />
          </Link>
          <Link
            href="https://insiders.liveshare.vsengsaas.visualstudio.com/join?CFB4BC93A36C4A5B6746F6A27568716E8DD0"
            label="Live"
          >
            <ion-icon name="link" />
          </Link>
        </Links>
        <Container>
          Click Me
          <span role="img" aria-label="arrow down">
            ↓
          </span>
          <Button onClick={this.handleClick.bind(this)}>
            <span role="img" aria-label="angel">
              😇
            </span>
          </Button>
        </Container>
        <Clicks>{`
        Clicked the button ${this.state.clicks} times.
        `}</Clicks>
      </Container>
    );
  }
}

export default App;

injectGlobal`
  html, body {
    padding: 0;
    margin: 0;
    user-select: none;
  }
`;

const Container = styled.div`
  width: 100vw;
  height: 100vh;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  background-color: #f5e6e8;

  font-size: 2rem;
`;

const Clicks = styled.span`
  font-size: 4rem;
  padding-bottom: 2rem;
`;

const Button = styled.button`
  background-color: #d5c6e0;
  color: #192a51;

  height: 3rem;
  width: 12rem;

  font-size: 2rem;
  line-height: 2rem;
`;

const Links = styled.div`
  display: flex;
  width: 95vw;
  align-items: center;
  justify-content: flex-end;
  padding: 20px;
`;

const Link = styled.a`
  position: relative;
  margin: 0 2rem;
  color: #192a51;

  &:visited {
    color: #192a51;
  }

  &:after {
    content: '${props => props.label}';
    font-size: 1rem;
    position: absolute;
    top: 2rem;
    left: calc(50% - ${props => props.label.length}px);
    transform: translateX(-50%);
  }
`;

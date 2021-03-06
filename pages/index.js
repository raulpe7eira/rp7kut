import React from 'react';
import nookies from 'nookies';
import jwt from 'jsonwebtoken';
import MainGrid from '../src/components/MainGrid';
import Box from '../src/components/Box';
import { OrkutNostalgicIconSet, Rp7kutMenu, Rp7kutProfileSidebarMenuDefault } from '../src/lib/Rp7kutCommons';
import { ProfileRelationsBoxWrapper } from '../src/components/ProfileRelations';

function ProfileSidebar(propriedades) {
  return (
    <Box as="aside">
      <img src={`https://github.com/${propriedades.githubUser}.png`} style={{ borderRadius: '8px' }} />
      <hr />

      <p>
        <a className="boxLink" href={`https://github.com/${propriedades.githubUser}`}>
          @{propriedades.githubUser}
        </a>
      </p>
      <hr />

      <Rp7kutProfileSidebarMenuDefault />
    </Box>
  );
}

function ProfileRelationsBox(propriedades) {
  return (
    <ProfileRelationsBoxWrapper>
      <h2 className="smallTitle">
        {propriedades.title} ({propriedades.items.length})
      </h2>
      <ul>
        {propriedades.items.slice(0, 6).map((itemAtual) => {
          return (
            <li key={itemAtual.login}>
              <a href={`https://github.com/${itemAtual.login}`}>
                <img src={itemAtual.avatar_url} />
                <span>{itemAtual.login}</span>
              </a>
            </li>
          )
        })}
      </ul>
    </ProfileRelationsBoxWrapper>
  )
}

export default function Home(props) {
  const usuarioAleatorio = props.githubUser;

  const [seguidores, setSeguidores] = React.useState([]);
  React.useEffect(function () {
    fetch('https://api.github.com/users/peas/followers')
      .then((respostaDoServidor) => respostaDoServidor.json())
      .then((respostaCompleta) => {
        setSeguidores(respostaCompleta);
      })
  }, [])

  const [comunidades, setComunidades] = React.useState([]);
  const [requestLimitsExceededDataCMS, setRequestLimitsExceededDataCMS] = React.useState([]);
  const request = {
    method: 'POST',
    headers: {
      'Authorization': '99e9a08d4e8f9af6294b10f909c68b',
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({
      "query": `query {
        allCommunities {
          id
          title
          imageUrl
          creatorSlug
        }
      }`
    })
  };
  fetch('https://graphql.datocms.com/', request)
    .then((response) => response.json())
    .then((respostaCompleta) => {
      if (typeof respostaCompleta.errors !== "undefined") {
        setRequestLimitsExceededDataCMS(true);
      } else {
        setRequestLimitsExceededDataCMS(false);
        setComunidades(respostaCompleta.data.allCommunities);
      }
    })

  const [favoritos, setFavoritos] = React.useState([]);
  React.useEffect(function () {
    fetch('https://api.github.com/users/peas/following')
      .then((respostaDoServidor) => respostaDoServidor.json())
      .then((respostaCompleta) => {
        setFavoritos(respostaCompleta);
      })
  }, [])

  return (
    <>
      <Rp7kutMenu githubUser={usuarioAleatorio} />
      <MainGrid>
        {/* <Box style="grid-area: profileArea;"> */}
        <div className="profileArea" style={{ gridArea: 'profileArea' }}>
          <ProfileSidebar githubUser={usuarioAleatorio} />
        </div>
        <div className="welcomeArea" style={{ gridArea: 'welcomeArea' }}>
          <Box>
            <h1 className="title">
              Bem vindo(a)
            </h1>

            <OrkutNostalgicIconSet />
          </Box>

          <Box>
            <h2 className="subTitle">O que voc?? deseja fazer?</h2>
            <form onSubmit={function handleCriaComunidade(e) {
              e.preventDefault();
              const dadosDoForm = new FormData(e.target);

              console.log('Campo: ', dadosDoForm.get('title'));
              console.log('Campo: ', dadosDoForm.get('image'));

              const comunidade = {
                title: dadosDoForm.get('title'),
                imageUrl: dadosDoForm.get('image'),
                creatorSlug: usuarioAleatorio,
              }

              const request = {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(comunidade)
              };
              fetch('/api/comunidades', request)
                .then(async (response) => {
                  const dados = await response.json();
                  const comunidade = dados.registroCriado;
                  const comunidadesAtualizadas = [...comunidades, comunidade];
                  setComunidades(comunidadesAtualizadas)
                })
            }}>
              <div>
                <input
                  placeholder="Qual vai ser o nome da sua comunidade?"
                  name="title"
                  aria-label="Qual vai ser o nome da sua comunidade?"
                  type="text"
                />
              </div>
              <div>
                <input
                  placeholder="Coloque uma URL para usarmos de capa"
                  name="image"
                  aria-label="Coloque uma URL para usarmos de capa"
                />
              </div>

              <button>
                Criar comunidade
              </button>
            </form>
          </Box>
        </div>
        <div className="profileRelationsArea" style={{ gridArea: 'profileRelationsArea' }}>
          <ProfileRelationsBox title="Seguidores" items={seguidores} />
          <ProfileRelationsBoxWrapper>
            <h2 className="smallTitle">
              Comunidades ({comunidades.length})
            </h2>
            {
              requestLimitsExceededDataCMS
                ? <p style={{ color: 'red' }}>DatoCMS requests limits exceeded</p>
                : <ul>
                  {
                    comunidades.slice(0, 6).map((itemAtual) => {
                      return (
                        <li key={itemAtual.id}>
                          <a href={`/communities/${itemAtual.id}`}>
                            <img src={itemAtual.imageUrl} />
                            <span>{itemAtual.title}</span>
                          </a>
                        </li>
                      )
                    })
                  }
                </ul>
            }
          </ProfileRelationsBoxWrapper>
          <ProfileRelationsBoxWrapper>
            <h2 className="smallTitle">
              Pessoas da comunidade ({favoritos.length})
            </h2>

            <ul>
              {favoritos.slice(0, 6).map((itemAtual) => {
                return (
                  <li key={itemAtual.id}>
                    <a href={`/users/${itemAtual.login}`}>
                      <img src={`${itemAtual.avatar_url}`} />
                      <span>{itemAtual.login}</span>
                    </a>
                  </li>
                )
              })}
            </ul>
          </ProfileRelationsBoxWrapper>
        </div>
      </MainGrid>
    </>
  );
}

export async function getServerSideProps(context) {
  const isProd = process.env.NODE_ENV === 'production';
  const baseUrl = isProd
    ? 'https://rp7kut.vercel.app'
    : 'http://localhost:3000';

  const cookies = nookies.get(context);
  const token = cookies.USER_TOKEN;
  const request = { headers: { Authorization: token } };

  var { isAuthenticated } = await fetch(`${baseUrl}/api/auth`, request)
    .then((resposta) => resposta.json());

  if (!isAuthenticated) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      }
    }
  }

  const { githubUser } = jwt.decode(token);
  return {
    props: {
      githubUser
    }, // will be passed to the page component as props
  };
}

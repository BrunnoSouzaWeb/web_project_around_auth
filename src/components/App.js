import Header from "../components/Header";
import Main from "../components/Main";
import Footer from "../components/Footer";
import ImagePopup from "./ImagePopup";
import { useState, useEffect } from "react";
import api from "../utils/api";

import EditProfilePopup from "./EditProfilePopup";
import EditAvatarPopup from "./EditAvatarPopup";

import NewCard from "../components/NewCard.js";

import CurrentUserContext from "../contexts/CurrentUserContext.js";

function App() {
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
  const [isNewCardOpen, setIsNewCardOpen] = useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);

  const [cards, setCards] = useState([]);
  const [selectedCard, setSelectedCard] = useState(null);

  const [currentUser, setCurrentUser] = useState({});

  const onEditProfileClick = () => {
    setIsEditProfilePopupOpen(true);
  };

  const handleEditAvatarClick = () => {
    setIsEditAvatarPopupOpen(true);
  };

  function handleUpdateUser({ name, about }) {
    api
      .updateEditPerfil(name, about)
      .then((updatedUserData) => {
        setCurrentUser(updatedUserData);
        closeAllPopups();
      })
      .catch((err) => {
        console.error(`Erro ao atualizar o perfil: ${err}`);
      });
  }

  const handleUpdateAvatar = async ({ avatar }) => {
    return await api.updateAvatar(avatar).then((updatedUserData) => {
      setCurrentUser(updatedUserData);
      closeAllPopups();
    });
  };

  const handleAddPlaceSubmit = async ({ name, link }) => {
    return await api.addNewCard(name, link).then((newCard) => {
      setCards([newCard, ...cards]);
      closeAllPopups();
    });
  };

  const onEditAvatarClick = () => {
    setIsEditAvatarPopupOpen(true);
  };

  function handleCardClick(card) {
    setSelectedCard(card);
  }

  const onAddPlaceClick = () => {
    setIsNewCardOpen(true);
  };

  const closeAllPopups = () => {
    setIsEditProfilePopupOpen(false);
    setIsNewCardOpen(false);
    setIsEditAvatarPopupOpen(false);
    setSelectedCard(null);
    setIsNewCardOpen(false);
  };

  useEffect(() => {
    api
      .getUserInfo()
      .then((ApiUserInfo) => {
        setCurrentUser(ApiUserInfo);
      })
      .catch((err) => {
        console.log("Erro ao carregar dados do usuário: ", err);
      });
  }, []);

  useEffect(() => {
    api
      .getInitialCards()
      .then(setCards)
      .catch((err) => console.log("Erro ao obter dados dos cartões :", err));
  }, []);

  async function handleCardLike(card) {
    const isLiked = card.likes.some((user) => user._id === currentUser._id);

    await api
      .changeLikeCardStatus(card._id, !isLiked)
      .then((newCard) => {
        setCards((state) =>
          state.map((currentCard) =>
            currentCard._id === card._id ? newCard : currentCard
          )
        );
      })
      .catch((error) => console.error(error));
  }

  function handleCardDelete(card) {
    if (!card) {
      return;
    }

    api
      .deleteCard(card._id)
      .then(() => {
        setCards((state) => state.filter((c) => c._id !== card._id));
        ///closeAllPopups(); // Fechas os popups
      })
      .catch((err) => console.error(`Erro ao eliminar o cartao: ${err}`));
  }

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className="page">
        <EditProfilePopup
          isOpen={isEditProfilePopupOpen}
          onClose={closeAllPopups}
          onUpdateUser={handleUpdateUser}
        />

        <NewCard
          isOpen={isNewCardOpen}
          onClose={closeAllPopups}
          onAddPlaceSubmit={handleAddPlaceSubmit}
        ></NewCard>

        <EditAvatarPopup
          isOpen={isEditAvatarPopupOpen}
          onClose={closeAllPopups}
          onUpdateAvatar={handleUpdateAvatar}
        />
        <Header />
        <Main
          AddPlace={isNewCardOpen}
          EditAvatar={isEditAvatarPopupOpen}
          onEditProfileClick={onEditProfileClick}
          onAddPlaceClick={onAddPlaceClick}
          onEditAvatarClick={onEditAvatarClick}
          closeAllPopups={closeAllPopups}
          cards={cards}
          onCardClick={handleCardClick}
          onCardLike={handleCardLike}
          onCardDelete={handleCardDelete}
        />
        {selectedCard && (
          <ImagePopup card={selectedCard} onClose={closeAllPopups} />
        )}
        <Footer />
      </div>
    </CurrentUserContext.Provider>
  );
}

export default App;

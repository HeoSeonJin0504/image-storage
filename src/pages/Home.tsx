import React, { useState } from "react";
import styled from "styled-components";
import Modal from "react-modal";
import backgroundimg from "./dbbackground.png";

Modal.setAppElement("#root");

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;

  background-image: url(${backgroundimg});
  min-height: 100vh;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  background-color: rgba(255, 255, 255, 0.5);
  background-blend-mode: lighten;

  h1 {
    font-size: 4em;
    text-align: center;
    font-family: "CormorantGaramond-BoldItalic", Arial, sans-serif;
    background: linear-gradient(45deg, #8b0000, #b22222, #006400);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  @media (max-width: 768px) {
    h1 {
      font-size: 3em;
    }
  }
`;

const ContentWrapper = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-around;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
  }
`;

const LeftContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;

  @media (max-width: 768px) {
    padding: 20px;
    width: 100%;
  }
`;

const RightContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px;
  justify-content: center;
  overflow-y: auto;
  overflow-x: hidden;

  @media (max-width: 768px) {
    padding: 20px;
    width: 100%;
  }
`;

const LeftForm = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  border: 2px solid black;
  border-radius: 10px;
  width: 40vw;
  height: 40vh;
  text-align: center;
  background-color: white;

  @media (max-width: 768px) {
    width: 80vw;
    height: 20vh;
  }
`;

const RightForm = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  border: 2px solid black;
  border-radius: 10px;
  width: 40vw;
  min-height: 40vh;
  max-height: 100vh;
  text-align: center;
  background-color: white;

  @media (max-width: 768px) {
    width: 80vw;
    min-height: 20vh;
  }
`;

const FileInput = styled.input`
  display: none;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  margin-top: 20px;

  @media (max-width: 768px) {
    gap: 10px;
  }
`;

const Button = styled.button`
  padding: 15px;
  text-decoration: none;
  background: #abb7b7;
  border: 2px solid #abb7b7;
  font-weight: bold;
  border-radius: 7px;
  color: white;
  font-size: 1.5em;
  cursor: pointer;

  @media (max-width: 768px) {
    font-size: 1.1em;
    padding: 10px;
    gap: 10px;
  }
`;

const ImagePreview = styled.img`
  max-width: 100%;
  max-height: 100%;
  margin-bottom: 10px;
  border: 1px solid black;
  border-radius: 5px;
`;

const ListBox = styled.ul`
  width: 100%;
  height: 200px;
  margin-top: 20px;
  list-style-type: none;
  padding: 0;
  overflow-y: auto;
  border: 1px solid #ccc;
  border-radius: 5px;

  @media (max-width: 768px) {
    height: auto;
  }
`;

const ListItem = styled.li<{ selected: boolean }>`
  padding: 10px;
  border-bottom: 1px solid #ccc;
  background-color: ${(props) => (props.selected ? "#e0e0e0" : "white")};
  cursor: pointer;

  &:last-child {
    border-bottom: 2px solid #ccc;
  }

  &:hover {
    background-color: #f0f0f0;
  }
`;

const ModalImage = styled.img`
  max-width: 100%;
  max-height: 100%;
`;

const ModalContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
`;

const ModalButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
`;

const Footer = styled.footer`
  position: absolute;
  bottom: 10px;
  right: 10px;
  font-size: 0.9em;
  color: #333;

  a {
    color: #333;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
`;

const Home = () => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageList, setImageList] = useState<{ name: string; path: string }[]>(
    []
  );
  const [selectedImagePath, setSelectedImagePath] = useState<string | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const backLink = "http://192.168.56.104:8000";

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyzeClick = async () => {
    if (!selectedImage) {
      alert("이미지를 먼저 업로드 해주세요.");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedImage as Blob);

    try {
      const response = await fetch(`${backLink}/upload`, {
        method: "POST",
        body: formData,
        mode: "cors",
      });

      if (!response.ok) {
        throw new Error("서버 응답 실패");
      }

      const result = await response.json();
      console.log("Response data:", result);

      if (result.file && result.file.name && result.file.path) {
        alert("이미지 저장 성공");
        setImageList((prevList) => [
          ...prevList,
          {
            name: decodeURIComponent(result.file.name), // UTF-8 디코딩 추가
            path: result.file.path.replace(/^uploads\//, ""), // '/uploads/' 제거
          },
        ]);
      } else {
        alert("서버에서 반환된 데이터 형식이 올바르지 않습니다.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("이미지 저장 실패(서버 오류)");
    }
  };

  const fetchImages = async () => {
    try {
      const response = await fetch(`${backLink}/files`, {
        method: "GET",
        mode: "cors",
      });

      if (!response.ok) {
        throw new Error("서버 응답 실패");
      }

      const data = await response.json();

      if (Array.isArray(data)) {
        setImageList(
          data.map((item) => ({
            name: decodeURIComponent(item.file_name),
            path: item.file_path.replace(/^uploads\//, ""),
          }))
        );
        setSelectedImagePath(null);
      } else {
        throw new Error("서버에서 반환된 데이터 형식이 올바르지 않습니다.");
      }
    } catch (error) {
      console.error("Error fetching images:", error);
      alert("이미지 새로고침 실패 (서버 오류)");
    }
  };

  const handleImageClick = (path: string) => {
    setSelectedImagePath(path);
  };

  const handleViewImageClick = () => {
    if (selectedImagePath) {
      setIsModalOpen(true);
    } else {
      alert("이미지를 선택해주세요.");
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <Container>
      <h1>Merry Christmas!</h1>
      <ContentWrapper>
        <LeftContainer>
          <LeftForm>
            {imagePreview && (
              <ImagePreview src={imagePreview} alt="Selected file preview" />
            )}
          </LeftForm>
          <ButtonContainer>
            <label htmlFor="fileInput" aria-label="이미지 선택">
              <Button as="span">이미지 열기</Button>
            </label>
            <FileInput
              id="fileInput"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
            />
            <Button onClick={handleAnalyzeClick}>이미지 저장</Button>
          </ButtonContainer>
        </LeftContainer>
        <RightContainer>
          <RightForm>
            <ListBox>
              {imageList.map((image, index) => (
                <ListItem
                  key={index}
                  selected={selectedImagePath === image.path}
                  onClick={() => handleImageClick(image.path)}
                >
                  {`${image.name}`}
                </ListItem>
              ))}
            </ListBox>
          </RightForm>
          <ButtonContainer>
            <Button onClick={fetchImages}>새로고침</Button>
            <Button onClick={handleViewImageClick}>이미지 보기</Button>
          </ButtonContainer>
        </RightContainer>
      </ContentWrapper>
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Image Modal"
      >
        <ModalContent>
          <ModalImage
            src={
              selectedImagePath
                ? `${backLink}/uploads/${selectedImagePath}`
                : ""
            }
            alt="Selected Image"
          />
          <ModalButtonContainer>
            <Button onClick={closeModal}>닫기</Button>
          </ModalButtonContainer>
        </ModalContent>
      </Modal>
      <Footer>
        Designed by{" "}
        <a href="https://www.freepik.com/free-vector/christmas-animal-doodle-characters-green-background_11564101.htm#fromView=search&page=2&position=49&uuid=f8f89f67-86e9-42a2-ba03-4903b0d86a14">Freepik</a>
      </Footer>
    </Container>
  );
};

export default Home;

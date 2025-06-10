'use client';

import React, { use, useEffect, useState } from "react";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import TinderCard from 'react-tinder-card';

type Cat = {
  id: string;
  tags: string[];
  mimetype: string;
  createdAt: string;
}

const CatPage = () => {
  const [cats, setCats] = useState<Cat[]>([]);
  const [likeCats, setLikeCats] = useState<Cat[]>([]);
  const [dislikeCats, setDislikeCats] = useState<Cat[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const cardRef = React.useRef<HTMLDivElement>(null);

  const fetchCats = async () => {
    const response = await fetch("https://cataas.com/api/cats?limit=15&skip=0");
    if (!response.ok) {
      throw new Error("Failed to fetch cats");
    }
    const data = await response.json();
    console.log(data);
    setCats(data);
  }

  const getCatImage = (id: string) => {
    return `https://cataas.com/cat/${id}`;
  }

  useEffect(() => {
    //Fetch 10 random cat images from the API
    fetchCats();
    setIsLoading(false);
  },[]);

  const handleSwipe = (direction: string, cat: Cat) => {
    if (direction === "left") {
      setDislikeCats(prev => [...prev, cat]);
      console.log("Disliked cat:", cat.id);
    } else if (direction === "right") {
      setLikeCats(prev => [...prev, cat]);
      console.log("Liked cat:", cat.id);
    }
  };

  const handleButtonClick = (direction: string, cat: Cat) => {
    if (direction === "left") {
      setDislikeCats(prev => [...prev, cat]);
      console.log("Button Disliked cat:", cat.id);
    } else if (direction === "right") {
      setLikeCats(prev => [...prev, cat]);
      console.log("Button Liked cat:", cat.id);
    }
  };

  const catRender = () => {
    if (isLoading) {
      return <p>Loading cats...</p>;
    }

    if(cats.length === 0) {
      return <p>No cats available at the moment.</p>;
    }

    const topCat = cats[0];

    return (
      <div className="card-container">
        {cats.map((cat) => (
          <TinderCard
            key={cat.id}
            onSwipe={(dir) => handleSwipe(dir, cat)}
            preventSwipe={['up', 'down']}
            className="swipe"
          >
            <Card className="cat-card">
              <CardHeader>
                <CardTitle>{cat.id}</CardTitle>
                <CardDescription>Tags: {cat.tags.join(", ")}</CardDescription>
              </CardHeader>
              <CardContent>
                <img src={getCatImage(cat.id)} alt={`Cat ${cat.id}`} className="cat-image" />
              </CardContent>
              <CardFooter>
                <button onClick={() => handleButtonClick("left", cat)}>Dislike</button>
                <button onClick={() => handleButtonClick("right", cat)}>Like</button>
              </CardFooter>
            </Card>
          </TinderCard>
        ))}
      </div>
    );
  };

  return (
    <div className="container mx-auto p-4">
      <h1>PawSwipe</h1>
      <div>
        {catRender()}
      </div>
    </div>
  );
};

export default CatPage;
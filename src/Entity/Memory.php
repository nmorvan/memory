<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass="App\Repository\MemoryRepository")
 */
class Memory
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    private $gamer;

    /**
     * @ORM\Column(type="datetime")
     */
    private $day;

    /**
     * @ORM\Column(type="integer")
     */
    private $duration;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getGamer(): ?string
    {
        return $this->gamer;
    }

    public function setGamer(?string $gamer): self
    {
        $this->gamer = $gamer;

        return $this;
    }

    public function getDay(): ?\DateTimeInterface
    {
        return $this->day;
    }

    public function setDay(\DateTimeInterface $day): self
    {
        $this->day = $day;

        return $this;
    }

    public function getDuration(): ?int
    {
        return $this->duration;
    }

    public function setDuration(int $duration): self
    {
        $this->duration = $duration;

        return $this;
    }
}

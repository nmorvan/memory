<?php

namespace App\Controller;

use App\Entity\Memory;
use App\Repository\MemoryRepository;
use Doctrine\ORM\EntityManagerInterface;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;

class MemoryController extends AbstractController
{

    /**
     * @Route("/")
     */
    public function homePage()
    {
        return $this->render('homepage.html.twig');
    }

    /**
     * @Route("/memory/new/{gamer}/{duration}")
     */
    function new ($gamer, $duration, EntityManagerInterface $em) {        
        $memory = new Memory();
        $memory->setGamer($gamer)
            ->setDay(new \DateTime(date("Y-m-d")))
            ->setDuration($duration);

        $em->persist($memory);
        $em->flush();

        return new Response(sprintf(
            'Hiya! New Memory id: #%d ',
            $memory->getId()
        ));
    }

    /**
     * @Route("/memory/all")
     */
    public function getBestRounds(MemoryRepository $repository)
    {
        $memories = $repository->findAll();
        return new JsonResponse(["memories" => $memories]);

    }
}

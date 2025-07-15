import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import dbConnect from '@/lib/db';
import Contest from '@/models/Contest';
import ContestSlugPage from '@/components/contest-slug-page';
import { Contest as ContestType } from '@/types/contest';

interface Props {
  params: { slug: string };
}

async function getContest(slug: string): Promise<ContestType | null> {
  try {
    await dbConnect();
    
    const contest = await Contest.findOne({ slug, activ: true }).lean().exec() as any;
    
    if (!contest) {
      return null;
    }
    
    // Convertim explicit obiectul Mongoose într-un obiect simplu
    const plainContest = {
      _id: contest._id.toString(),
      nume: contest.nume,
      slug: contest.slug,
      dataDesfasurarii: contest.dataDesfasurarii.toISOString(),
      localitate: contest.localitate,
      locatie: contest.locatie,
      adresa: contest.adresa,
      descriere: contest.descriere,
      logoUrl: contest.logoUrl || '',
      linkSiteOficial: contest.linkSiteOficial || '',
      socialMedia: contest.socialMedia || {},
      organizatorId: contest.organizatorId,
      activ: contest.activ,
      createdAt: contest.createdAt.toISOString(),
      updatedAt: contest.updatedAt.toISOString(),
    };
    
    return plainContest as ContestType;
  } catch (error) {
    console.error('Error fetching contest:', error);
    return null;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const contest = await getContest(params.slug);
  
  if (!contest) {
    return {
      title: 'Concurs nu a fost găsit',
      description: 'Concursul căutat nu există sau nu mai este disponibil.',
    };
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('ro-RO', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  return {
    title: `${contest.nume} - ${contest.localitate} | DanceContest Pro`,
    description: `${contest.descriere.substring(0, 160)}...`,
    keywords: `${contest.nume}, concurs dans, ${contest.localitate}, ${formatDate(contest.dataDesfasurarii)}`,
    openGraph: {
      title: contest.nume,
      description: contest.descriere,
      type: 'website',
      images: contest.logoUrl ? [
        {
          url: contest.logoUrl,
          width: 1200,
          height: 630,
          alt: contest.nume,
        },
      ] : [],
      siteName: 'DanceContest Pro',
    },
    twitter: {
      card: 'summary_large_image',
      title: contest.nume,
      description: contest.descriere,
      images: contest.logoUrl ? [contest.logoUrl] : [],
    },
  };
}

export default async function ContestPage({ params }: Props) {
  const contest = await getContest(params.slug);
  
  if (!contest) {
    notFound();
  }
  
  return <ContestSlugPage contest={contest} />;
}

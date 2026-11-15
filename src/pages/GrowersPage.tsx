import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, Search } from "lucide-react";
import PageContainer from "../components/layout/PageContainer";
import EmptyState from "../components/ui/EmptyState";
import { getGrowerById, getGrowers, type Grower } from "../features/growers/growerDirectoryData";

const PAGE_SIZE = 12;

function GrowerCard({ grower }: { grower: Grower }) {
  return (
    <article className="grower-directory-card">
      <div className="grower-directory-image">
        {grower.image ? <img src={grower.image} alt={`${grower.name} profile`} /> : <span aria-hidden="true">{grower.name.charAt(0)}</span>}
      </div>
      <div className="grower-directory-card-body">
        <p className="grower-directory-location">{grower.district}</p>
        <h2>{grower.name}</h2>
        <p>{grower.specialization}</p>
        <Link className="button outline" to={`/growers/${grower.id}`}>View Profile</Link>
      </div>
    </article>
  );
}

export default function GrowersPage() {
  const { id } = useParams();
  if (id) return <GrowerProfile id={id} />;
  return <GrowerDirectory />;
}

function GrowerDirectory() {
  const [growers, setGrowers] = useState<Grower[]>([]);
  const [query, setQuery] = useState("");
  const [district, setDistrict] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [page, setPage] = useState(1);
  useEffect(() => { void getGrowers().then(setGrowers); }, []);
  const districts = [...new Set(growers.map((g) => g.district))];
  const specializations = [...new Set(growers.map((g) => g.specialization))];
  const filtered = useMemo(() => growers.filter((g) =>
    g.name.toLowerCase().includes(query.toLowerCase()) && (!district || g.district === district) && (!specialization || g.specialization === specialization)), [growers, query, district, specialization]);
  const pages = Math.ceil(filtered.length / PAGE_SIZE);
  const visible = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const reset = () => { setQuery(""); setDistrict(""); setSpecialization(""); setPage(1); };
  return <PageContainer className="grower-directory-page">
    <p className="foundation-eyebrow">FLORACONNECT COMMUNITY</p>
    <h1>Growers</h1>
    <p className="grower-directory-intro">Discover individual flower growers from across Sri Lanka.</p>
    <p className="grower-directory-count">{growers.length} published grower profiles</p>
    <form className="catalogue-toolbar grower-directory-toolbar" role="search" onSubmit={(e) => e.preventDefault()}>
      <label className="catalogue-search-field"><Search size={18} aria-hidden="true" /><span className="sr-only">Search growers</span><input value={query} onChange={(e) => { setQuery(e.target.value); setPage(1); }} placeholder="Search growers..." /></label>
      <label><span className="sr-only">District</span><select value={district} onChange={(e) => { setDistrict(e.target.value); setPage(1); }}><option value="">All districts</option>{districts.map((item) => <option key={item}>{item}</option>)}</select></label>
      <label><span className="sr-only">Specialization</span><select value={specialization} onChange={(e) => { setSpecialization(e.target.value); setPage(1); }}><option value="">All specializations</option>{specializations.map((item) => <option key={item}>{item}</option>)}</select></label>
      <button type="button" className="button outline" onClick={reset}>Reset Filters</button>
    </form>
    {growers.length === 0 ? <EmptyState title="No grower profiles available yet" message="Registered flower growers will appear here once their public profiles are published." /> : visible.length === 0 ? <EmptyState title="No matching growers found" message="Try changing your search or filters." /> : <div className="grower-directory-grid">{visible.map((g) => <GrowerCard key={g.id} grower={g} />)}</div>}
    {pages > 1 && <nav className="catalogue-pagination" aria-label="Grower pages"><button className="button outline" disabled={page === 1} onClick={() => setPage(page - 1)}><ArrowLeft size={15} /> Previous</button><span>Page {page} of {pages}</span><button className="button outline" disabled={page === pages} onClick={() => setPage(page + 1)}>Next <ArrowRight size={15} /></button></nav>}
  </PageContainer>;
}

function GrowerProfile({ id }: { id: string }) {
  const [grower, setGrower] = useState<Grower>();
  useEffect(() => { void getGrowerById(id).then(setGrower); }, [id]);
  if (!grower) return <PageContainer><EmptyState title="Grower profile not found" message="This public grower profile is not available." /><Link className="button outline" to="/growers">Back to Growers</Link></PageContainer>;
  return <PageContainer className="grower-profile-page"><Link className="grower-back-link" to="/growers"><ArrowLeft size={16} /> Back to Growers</Link><section className="grower-profile-hero"><div className="grower-profile-image">{grower.image && <img src={grower.image} alt={`${grower.name} profile`} />}</div><div className="grower-profile-copy"><p className="foundation-eyebrow">{grower.district}, {grower.province}</p><h1>{grower.name}</h1><p className="grower-profile-specialization">{grower.specialization}</p><p>{grower.biography}</p><Link className="button" to="/login">Send Inquiry</Link></div></section><section className="grower-listings"><div className="grower-listings-heading"><div><p className="foundation-eyebrow">FROM THE GROWER</p><h2>Flower Plants</h2></div><span>{grower.listings.length} {grower.listings.length === 1 ? "listing" : "listings"}</span></div>{grower.listings.length ? <div className="grower-listings-grid">{grower.listings.map((listing) => <Link className="grower-listing-card" key={listing.id} to={`/flowers/${listing.id}`}><div className="grower-listing-image">{listing.image ? <img src={listing.image} alt="" /> : <span aria-hidden="true">🌿</span>}</div><div className="grower-listing-copy"><span>{listing.category}</span><strong>{listing.name}</strong><em>View plant details <ArrowRight size={14} /></em></div></Link>)}</div> : <EmptyState title="No published flower plants yet" message="This grower has not published any flower plant listings." />}</section></PageContainer>;
}

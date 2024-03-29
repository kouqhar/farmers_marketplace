import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import FormGroup from "../../UI/FormGroup"
import SignUpUI from "./SignUpUI"
import {
	AccountFourImage, Upload,
	FarmName,
	Coordinate,
	CropProduced,
	Delete,
	Edit,
	AddedFarm,
	DocumentIcon,
} from "../../assets/images"

// Styles
import styles from "./styles/styles.module.css"

const CROPS = [
	{
		name: "Maize"
	},
	{
		name: "Rice"
	},
	{
		name: "Strawberry"
	},
	{
		name: "Avocado"
	},
	{
		name: "Cashews"
	},
	{
		name: "Grapes"
	},
]

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May"]

const InitialFarm = {
	name: "",
	long: "2.1547",
	lat: "24.927",
	crop: "none",
	from: "",
	to: "",
	docUploads: []
}

const TimeLineFour = ({ handleFormData, signupResponse, toastify }) => {
	const [newUser, setNewUser] = useState([])
	const [farmDetails, setFarmDetails] = useState(InitialFarm)
	const [isBtnDisabled, setIsBtnDisabled] = useState(true)
	const [isModalOpen, setIsModalOpen] = useState(false)
	const [farms, setFarms] = useState([])
	const [crops, setCrops] = useState([])
	const navigate = useNavigate()
	const pageData = {
		image: AccountFourImage,
		alt: "Farm Registration",
		formInfo: "Farm Registration"
	}

	useEffect(() => {
		setNewUser(signupResponse);
	}, [signupResponse])

	useEffect(() => {
		if (crops.length > 0 || farmDetails.name.trim().length > 0)
			setIsBtnDisabled(false)
		else setIsBtnDisabled(true)
	}, [crops, farmDetails.name])

	const handleInputChange = e => {
		e.preventDefault()
		const [fieldName, fieldValue] = [e.target.name, e.target.value]

		setFarmDetails(prevState => ({
			...prevState,
			[fieldName]: fieldValue
		}))
	}

	const handleNewCrop = e => {
		e.preventDefault()
		setCrops(prevState => ([...prevState, farmDetails]))
	}

	const handleModalClose = e => setIsModalOpen(false)
	const handleDeleteCrop = id => setCrops(prevState => prevState.filter((elem, idx) => idx !== id))
	const handleDeleteFarm = id => setFarms(prevState => prevState.filter((elem, idx) => idx !== id))

	// TODO: 
	const handleEditFarm = id => {
	}

	const handleAddFarm = () => {
		const crop = crops.map(crop => {
			if (crop.crop.trim() !== "") return crop.crop
		})

		setIsModalOpen(true)
		setFarms(prevState => (
			[...prevState,
			{
				...farmDetails,
				crops: crop
			}
			]
		))

		setCrops([])
	}

	const sendTimelineFour = () => {
		const crops = farms.map(({ crops }, idx) => crops).flat(1)
		handleFormData(["farmDetails", [{ ...farmDetails, crops, farms }]])
	}

	return (
		<SignUpUI pageData={pageData}>

			{
				isModalOpen &&
				<div className={[styles.Modal, "Modal"].join(" ")}>
					<div onClick={handleModalClose} className={[styles.Modal_backdrop, "Modal_backdrop"].join(" ")}></div>

					<div className={styles.Modal_content}>
						<div className={styles.Modal_content__logo}>
							<img src={AddedFarm} alt="Official logo" />
						</div>
						<div className={styles.Modal_content__text}>
							<h1>
								{
									farms.length < 1 ?
										"Farm added!" :
										`You've added ${farms.length} farm${farms.length > 1 ? "s" : ""}`
								}
							</h1>
							<p>Would you like to add another farm?</p>
						</div>
						<div className={styles.Modal_content__btns}>
							<button onClick={() => {
								sendTimelineFour()
							}
							}>No, create my account</button>
							<button onClick={handleModalClose} className={["go_back"].join(" ")}>Yes, I have another farm</button>
						</div>
					</div>

				</div>
			}
			<div className={styles.TimelineFour}>
				{
					farms.length > 0 && (
						<div className={styles.TimelineFour_farms}>
							{
								farms?.map(({ name,
									long,
									lat,
									crop,
									crops,
									from,
									to,
									docUploads }, idx) => (
									<div key={`${name}-${idx}`} className={styles.TimelineFour_farms__card}>
										<div className={styles.TimelineFour_farms__card___header}>
											<h2>{name}</h2>
											<div>
												<button className={styles.TimelineFour_deletecrop__deletebtn} onClick={() => handleEditFarm(idx)}>
													<img src={Edit} alt="Edit Farm" />
												</button>
												<button className={styles.TimelineFour_deletecrop__deletebtn} onClick={() => handleDeleteFarm(idx)}>
													<img src={Delete} alt="Delete Farm" />
												</button>
											</div>
										</div>
										<hr />

										<div className={styles.TimelineFour_farms__card___content}>

											<div className={[styles.TimelineFour_farms__card___content____details, "space_between"].join(" ")}>

												<div className={[styles.farmname, "space_between"].join(" ")}>
													<img src={FarmName} alt="Farm Name" />
													<div>
														<h4>Farm Name</h4>
														<p>{name}</p>
													</div>
												</div>
												<div className={[styles.coordinate, "space_between"].join(" ")}>
													<div className={[styles.long, "space_between"].join(" ")}>
														<img src={Coordinate} alt="" />
														<div>
															<h4>Longitude</h4>
															<p>{long}<sup>o</sup>N</p>
														</div>
													</div>
													<div className={styles.lat}>
														<h4>Latitude</h4>
														<p>{lat}<sup>o</sup>E</p>
													</div>
												</div>
											</div>

											<div className={[styles.TimelineFour_farms__card___content____crops, "space_between"].join(" ")}>


												<div className={[styles.produced, "space_between"].join(" ")}>
													<img src={CropProduced} alt="" />
													<div className={styles.crop}>
														<h4>Crops Produced</h4>
														<div className={styles.cropcard}>

															{
																crops.length > 0 ? (
																	crops.map(crop => <p className={styles.crop_card}>{crop}</p>)
																) : <p className={styles.crop_card}>{crop}</p>
															}
														</div>
													</div>
												</div>
												<div className={styles.document}>
													<h4>Documents</h4>
													<p>
														{
															docUploads ||
															<img src={DocumentIcon} alt="Document" />
														}
													</p>
												</div>
											</div>
										</div>
									</div>
								))
							}
						</div>)
				}
				<FormGroup className={styles.TimelineFour_farmName}>
					<div className={styles.TimelineFour_farmName__name}>
						<label>Farm Name * </label>
						<input
							onChange={handleInputChange}
							value={farmDetails?.name}
							placeholder="Enter Farm Name"
							name="name"
							required />
					</div>
				</FormGroup>
				<FormGroup className={styles.TimelineFour_coordinate}>
					<label>Farm Coordinates <span>(Optional)</span> </label>
					<div className={styles.TimelineFour_coordinate__location}>
						<div className={styles.TimelineFour_coordinate__location___long}>
							<input
								onChange={handleInputChange}
								value={farmDetails?.long}
								placeholder="Longitude"
								maxLength={5}
								name="long" />
						</div>
						<div className={styles.TimelineFour_coordinate__location___lat}>
							<input
								onChange={handleInputChange}
								value={farmDetails?.lat}
								placeholder="Latitude"
								maxLength={5}
								name="lat" />
						</div>
					</div>
					<p>EX: Longitude: 8.5753<sup>o</sup>E Latitude: 9.0820<sup>o</sup>N</p>
				</FormGroup>
				{/* CROPS */}
				<h3>Crops cultivated and planting season</h3>
				<div className={styles.TimelineFour_croplists}>
					{
						crops.length > 0 && (
							crops?.map((farm, idx) => (
								<div className={styles.TimelineFour_crops} key={`${farm?.name}-${idx}`}>
									<div className={styles.TimelineFour_deletecrop}>
										<p>{farm?.name}</p>
										<button className={styles.TimelineFour_deletecrop__deletebtn} onClick={() => handleDeleteCrop(idx)}>X</button>
									</div>
									<FormGroup>
										<div className={styles.TimelineFour_crops__crop}>
											<label>What crop do you cultivate on this farm? </label>
											<div className={styles.TimelineFour_crops__crop___name}>
												<select name="crop">
													<option value={farm?.crop}>{farm?.crop}</option>
												</select>
											</div>
										</div>
										<div className={styles.TimelineFour_crops__duration}>
											<div className={styles.TimelineFour_crops__duration___from}>
												<label>Start Month </label>
												<select name="from">
													<option value={farm?.from}>{farm?.from}</option>
												</select>
											</div>
											<div className={styles.TimelineFour_crops__duration___to}>
												<label>End Month </label>
												<select name="to">
													<option value={farm?.to}>{farm?.to}</option>
												</select>
											</div>
										</div>
									</FormGroup>
								</div>
							))
						)
					}
				</div>
				<FormGroup className={styles.TimelineFour_crops}>
					<div className={styles.TimelineFour_crops__crop}>
						<label>What crop do you cultivate on this farm? </label>
						<div className={styles.TimelineFour_crops__crop___name}>
							<select
								name="crop"
								value={farmDetails.crop}
								onChange={handleInputChange}>
								<option value={"Select crop"}>{"Select crop "}</option>
								{
									CROPS.map(({ name }, idx) => (<option key={`${name}-${idx}`} value={name}>{name}</option>))
								}
							</select>
						</div>
					</div>
					<div className={styles.TimelineFour_crops__duration}>
						<div className={styles.TimelineFour_crops__duration___from}>
							<label>Start Month </label>
							<select
								name="from"
								value={farmDetails.from}
								onChange={handleInputChange}>
								<option value={"Select Start Month"}>{"Select Start Month "}</option>
								{
									MONTHS.map((month, idx) => (<option key={`start-${month}-${idx}`} value={month}>{month}</option>))
								}
							</select>
						</div>
						<div className={styles.TimelineFour_crops__duration___to}>
							<label>End Month </label>
							<select
								name="to"
								value={farmDetails.to}
								onChange={handleInputChange}>
								<option value={"Select End Month"}>{"Select End Month "}</option>
								{
									MONTHS.map((month, idx) => (<option key={`end-${month}-${idx}`} value={month}>{month}</option>))
								}
							</select>
						</div>
					</div>
				</FormGroup>

				<button className={styles.TimelineFour_newcropbtn} onClick={handleNewCrop} disabled={isBtnDisabled && !farmDetails.name.trim().length > 0}> + Add another crop</button>

				<FormGroup className={styles.TimelineFour_farmDocument}>
					<div className={styles.TimelineFour_farmDocument__document}>
						<label>Upload Farm documents (optional) </label>
						<div className={styles.TimelineFour_farmDocument__document___file}>
							<img src={Upload} alt="Farm Document" />
							<input
								onChange={handleInputChange}
								type="file"
								value={farmDetails?.docUploads}
								name="docUploads" />
							<p>PNG, JPG or PDF<span>(Max 10MB)</span></p>
						</div>
					</div>
				</FormGroup>
				<div className={["navigation_btn"]}>
					<button onClick={() => handleNaviIndex(3)} className={["go_back"].join(" ")}>Back</button>
					<button
						disabled={!crops.length > 0}
						onClick={handleAddFarm}
						className={["forward"].join(" ")}>Add Farm</button>
				</div>
			</div>
		</SignUpUI>
	)
}

export default TimeLineFour
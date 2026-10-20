# This code retrieves TESS light curves for an object given its TIC number.
# It will combine data for all existing sectors and perform a period search
# using a Lomb-Scargle periodogram.
# It all searches for the object in Gaia DR2.
# The output is a plot showing the periodogram, the Gaia CMD, and the phase-
# folded light to both the period and twice the period (useful for binary
# systems where the dominant peak is often an alias).

__version__ = "2.0"
__author__ = "Ingrid Pelisoli"
# Expanded functionality provided by Thomas Stackhouse

#####  IMPORTING PACKAGES  ######

import numpy as np
import matplotlib.pyplot as plt
import matplotlib.gridspec as gridspec
from astropy.io import ascii
from astropy.io import fits
from astropy.io.votable import parse_single_table
from astroquery.mast import Observations
from astroquery.gaia import Gaia
from astropy import wcs
from astropy.coordinates import SkyCoord, Distance, Angle
from astropy.time import Time
from astropy.visualization.mpl_normalize import ImageNormalize
import astropy.visualization as stretching
from lightkurve import search_targetpixelfile
import astropy.units as u
import sys
import pathlib
import TESSutils as tul

################################

###  FUNCTION FOR PLOTTING  ####


def make_plot(
    f,
    pow,
    fap,
    bjd0,
    flux0,
    bjd,
    flux,
    phi,
    flux_phi,
    fit,
    phi2,
    flux_phi2,
    fit2,
    period,
    crowd,
    ns,
):

    fig = plt.figure(figsize=(24, 15))

    plt.rcParams.update({"font.size": 22})

    gridspec.GridSpec(6, 10)

    # TIC Pixel Count Graph
    plt.subplot2grid((6, 10), (0, 0), colspan=2, rowspan=2)
    plt.title("TIC %d" % (TIC))
    mean_tpf = np.mean(tpf.flux.value, axis=0)
    nx, ny = np.shape(mean_tpf)
    norm = ImageNormalize(stretch=stretching.LogStretch())
    division = int(np.log10(np.nanmax(np.nanmean(tpf.flux.value, axis=0))))
    plt.imshow(
        np.nanmean(tpf.flux.value, axis=0) / 10**division,
        norm=norm,
        extent=[tpf.column, tpf.column + ny, tpf.row, tpf.row + nx],
        origin="lower",
        zorder=0,
    )
    plt.xlim(tpf.column, tpf.column + 10)
    plt.ylim(tpf.row, tpf.row + 10)
    if not warning:
        x = coords[:, 0] + tpf.column + 0.5
        y = coords[:, 1] + tpf.row + 0.5
        plt.scatter(x, y, c="firebrick", alpha=0.5, edgecolors="r", s=sizes)
        plt.scatter(x, y, c="None", edgecolors="r", s=sizes)
        plt.scatter(x[idx], y[idx], marker="x", c="white")
    plt.text(tpf.column, tpf.row, "crowdsap = %4.2f" % np.mean(crowd), color="w")
    plt.ylabel("Pixel count")
    plt.xlabel("Pixel count")

    # Gaia HR-diagram
    plt.subplot2grid((6, 10), (0, 2), colspan=2, rowspan=2)
    plt.scatter(s_bprp, s_MG, c="0.75", s=0.5, zorder=0)
    if len(gaia) > 1:
        plt.scatter(bprp_all, MG_all, marker="s", c="b", s=10, zorder=1)
    plt.gca().invert_yaxis()
    plt.title("$Gaia$ HR-diagram")
    if not warning:
        plt.plot(bprp, MG, "or", markersize=10, zorder=2)
    plt.ylabel("$M_G$")
    plt.xlabel("$G_{BP}-G_{RP}$")

    # Power and Period Graph
    plt.subplot2grid((6, 10), (2, 0), colspan=4, rowspan=2)
    plt.title("Period = %5.2f h" % period)
    plt.plot(1.0 / f, pow, color="k")
    plt.xlim(min(1.0 / f), max(1.0 / f))
    plt.axhline(fap, color="b")
    plt.axvline(period, color="r", ls="--", zorder=0)
    # plt.axvspan(100., max(1.0/freq), alpha=0.5, color='red')
    plt.xscale("log")
    plt.xlabel("P [h]")
    plt.ylabel("Power")

    # BJD Graph
    plt.subplot2grid((6, 10), (4, 0), colspan=4, rowspan=2)
    plt.title("%s sector/s" % ns)
    plt.xlabel("BJD - 2457000")
    plt.ylabel("Relative flux")
    plt.xlim(np.min(bjd), np.max(bjd))
    plt.scatter(bjd0, flux0, c="0.25", zorder=1, s=0.5)
    plt.scatter(bjd, flux, c="k", zorder=1, s=0.5)

    # Phase to Dominant Peak Graph
    phi_avg = tul.avg_array(phi, 50)
    fphi_avg = tul.avg_array(flux_phi, 50)

    plt.subplot2grid((6, 10), (0, 4), colspan=6, rowspan=3)
    plt.title("Phased to dominant peak")
    plt.xlabel("Phase")
    plt.ylabel("Relative flux")
    plt.xlim(0, 2)
    # plt.errorbar(phi, flux_phi, fmt='.', color='0.5', markersize=0.75, elinewidth=0.5, zorder=0)
    plt.scatter(phi_avg, fphi_avg, marker=".", color="0.5", zorder=0)
    plt.plot(
        tul.running_mean(phi_avg, 15), tul.running_mean(fphi_avg, 15), ".k", zorder=1
    )
    plt.plot(phi, fit, "r--", lw=3, zorder=2)
    # plt.errorbar(phi+1.0, flux_phi, fmt='.', color='0.5', markersize=0.75, elinewidth=0.5, zorder=0)
    plt.scatter(phi_avg + 1.0, fphi_avg, marker=".", color="0.5", zorder=0)
    plt.plot(
        tul.running_mean(phi_avg, 15) + 1.0,
        tul.running_mean(fphi_avg, 15),
        ".k",
        zorder=1,
    )
    plt.plot(phi + 1.0, fit, "r--", lw=3, zorder=2)

    # Phase to Twice the Peak Graph
    phi_avg = tul.avg_array(phi2, 50)
    fphi_avg = tul.avg_array(flux_phi2, 50)

    plt.subplot2grid((6, 10), (3, 4), colspan=6, rowspan=3)
    plt.title("Phased to twice the peak")
    plt.xlabel("Phase")
    plt.ylabel("Relative flux")
    plt.xlim(0, 2)
    # plt.errorbar(phi2, flux_phi2, fmt='.', color='0.5', markersize=0.75, elinewidth=0.5, zorder=0)
    plt.scatter(phi_avg, fphi_avg, marker=".", color="0.5", zorder=0)
    plt.plot(
        tul.running_mean(phi_avg, 15), tul.running_mean(fphi_avg, 15), ".k", zorder=1
    )
    plt.plot(phi2, fit2, "r--", lw=3, zorder=2)
    # plt.errorbar(phi2+1.0, flux_phi2, fmt='.', color='0.5', markersize=0.75, elinewidth=0.5, zorder=0)
    plt.scatter(phi_avg + 1.0, fphi_avg, marker=".", color="0.5", zorder=0)
    plt.plot(
        tul.running_mean(phi_avg, 15) + 1.0,
        tul.running_mean(fphi_avg, 15),
        ".k",
        zorder=1,
    )
    plt.plot(phi2 + 1.0, fit2, "r--", lw=3, zorder=2)

    plt.tight_layout()

    return fig


######################################

###  FUNCTION FOR EXPANDED GRAPH  ####


# To change default size of graph data points, change the
# 'point_size' value in the line below. Suggested values are:
# point_size=16 (default)
# point_size=32
# point_size=48
def make_expanded_graph(
    bjd_original,
    flux_original,
    bjd_clean,
    flux_clean,
    ns,
    figsize=(48, 30),
    point_size=16,
    font_size=32,
):

    fig = plt.figure(figsize=figsize)

    plt.rcParams.update({"font.size": font_size})

    plt.title("%s sector/s" % ns)
    plt.xlabel("BJD - 2457000")
    plt.ylabel("Relative flux")
    plt.xlim(np.min(bjd_clean), np.max(bjd_clean))
    # Plot the original values in light grey
    plt.scatter(bjd_original, flux_original, c="0.25", zorder=1, s=point_size)
    # Plot the cleaned values in black over original values
    plt.scatter(bjd_clean, flux_clean, c="k", zorder=1, s=point_size)
    plt.tight_layout()

    return fig


################################

#########  USER INPUT  #########

TIC_list = []
file_input_flag = False
create_detailed_graphs = False
show_questions_flag = False
question_input_flag = False
question_answers = None

# Process script arguments
for arg in sys.argv:

    # Check if argument is supposed to be an input file path
    if file_input_flag:

        # Read the input file
        with open(arg, "r") as file:
            for line in file:
                if line and line.strip().isdigit():
                    TIC_list.append(int(line.strip()))

        file_input_flag = False

    # Check if argument is supposed to be question inputs
    if question_input_flag:
        question_answers = arg
        question_input_flag = False

    # Check if argument is requesting help
    elif arg == "--help":
        print(
            """
            ########
            # HELP #
            ########

            Full usage:
            python3 TESS-LS.py [TIC #]... [OPTION]...


            To use this script, run the script name then any TIC number you would like to check:
            python3 TESS-LS.py [TIC #]

            Multiple TIC numbers may be provided to the script at once:
            python3 TESS-LS.py [TIC #] [TIC #]


            Additional options:

            --help
              Provides this help manual.

            -i
              The next argument will be the path of an input file. The input
              file should contain TIC numbers with each TIC number on a separate
              line. The easiest file format to use is '.txt'.
              Example:
              python3 TESS-LS.py [TIC #]... -i example_input.txt

            -q
              This flag provides questions for the user that can be used to
              gain additional information about the graphs or can modify some
              of the graph calculations. If this is used with the 'a' flag,
              the questions will not be displayed and the 'a' flag answers
              will be used instead.

            -a
              The next argument will be the values for user question answers.
              These questions are the same ones that show using the 'q' flag.
              There must be the same number of characters as there are questions.
              Example:
              python3 TESS-LS.py [TIC #]... -a 0000

            -d
              Create detailed versions of the graphs. These are good for zooming in
              to get better resolution views of the data in case it is not clear if
              an outburst is spotted.
"""
        )

    # Check if argument is a script flag
    elif len(arg) > 0 and arg[0] == "-":
        for flag in arg:

            # Check for 'i' flag to determine if next arg in list is an input file path
            # TIC numbers in the input file should be one TIC number per row
            if flag == "i":
                file_input_flag = True

            # Check for 'q' flag to determine if user questions should be shown
            # No flag means default answers are used
            # If used with the 'a' flag, that takes precedence
            if flag == "q":
                show_questions_flag = True

            # Check for 'a' flag to determine if next arg in list is question answers string
            if flag == "a":
                question_input_flag = True

            # Check for 'd' flag to determine if detailed graphs should be created
            if flag == "d":
                create_detailed_graphs = True

    # Check if argument is a number
    elif arg.isdigit():
        TIC_list.append(int(arg))


if len(TIC_list) < 1:
    print("No TIC value provided. Exiting.")
    sys.exit()

# Output ascii light curve?
flag_lc = 0
# Output ascii periodogram?
flag_ls = 0
# Output ascii phase?
flag_ph = 0
# Is the period actually 2*P?
flag_p2 = 0

if question_answers:
    if len(question_answers) == 4:
        flag_lc = int(question_answers[0])
        flag_ls = int(question_answers[1])
        flag_ph = int(question_answers[2])
        flag_p2 = int(question_answers[3])
    else:
        print(
            "There are 4 questions. If providing scripted answers, please answer all questions."
        )
        print("'%s' does not correctly answer the questions." % (question_answers))
        sys.exit()
elif show_questions_flag:
    flag_lc = int(
        input(
            "Would you like an ascii file of the processed light curve?\n0 = no (default), 1 = yes: "
        )
        or "0"
    )
    flag_ls = int(
        input(
            "Would you like an ascii file of the Lomb-Scargle periodogram?\n0 = no (default), 1 = yes: "
        )
        or "0"
    )
    flag_ph = int(
        input(
            "Would you like an ascii file of the phased data?\n0 = no (default), 1 = yes: "
        )
        or "0"
    )
    flag_p2 = int(
        input(
            "Would you like to multiply the period by two?\n"
            "(useful for ellipsoidal variables and some eclipsing systems)\n"
            "0 = no (default), 1 = yes: "
        )
        or "0"
    )

for TIC in TIC_list:
    print(
        """

##################
# TIC %09d #
##################

          """
        % (TIC)
    )

    ################################

    #######  DOWNLOAD DATA  ########

    # Searching for data at MAST

    obsTable = Observations.query_criteria(
        dataproduct_type="timeseries", project="TESS", target_name=TIC
    )

    # Create folder for results
    results_dir = "./Results_%09d/" % (TIC)
    print("Creating Results folder:", results_dir)
    pathlib.Path(results_dir).mkdir(exist_ok=True)

    # Download the 2-minute cadence light curves

    try:
        data = Observations.get_product_list(obsTable)
    except:
        log = open(results_dir + "TIC%09d_NO_DATA.log" % (TIC), "w")
        log.write("No data found for TIC %09d\n" % (TIC))
        log.close()
        continue

    download_lc = Observations.download_products(data, productSubGroupDescription="LC")
    infile = download_lc[0][:]
    n_slow = len(infile)

    print("I have found a total of %d 2-min light curve(s)." % (len(infile)))

    # Download the 20-second cadence light curves

    download_fast_lc = Observations.download_products(
        data, productSubGroupDescription="FAST-LC"
    )

    if download_fast_lc is None:
        print("I have found no 20-sec light curves.")
        fast = False
    else:
        infile_fast = download_fast_lc[0][:]
        n_fast = len(infile_fast)
        print(
            "I have found a total of %d 20-sec light curve(s)."
            % (len(download_fast_lc[0][:]))
        )
        fast = True

    # Dowload target pixel file for plotting
    print("Downloading pixel file for pixel count graph")
    tpf = search_targetpixelfile("TIC " + str(TIC), mission="TESS").download()

    ################################

    #########  GAIA MATCH  #########

    # First do a large search using 6 pixels
    print("Calculating Gaia HR diagram")

    coord = SkyCoord(
        ra=obsTable[0]["s_ra"],
        dec=obsTable[0]["s_dec"],
        unit=(u.degree, u.degree),
        frame="icrs",
    )
    # radius = u.Quantity(126.0, u.arcsec)
    rad = u.Quantity(126.0, u.arcsec)
    q = Gaia.cone_search_async(coord, radius=rad)
    gaia = q.get_results()
    # Select only those brighter than 18.
    gaia = gaia[gaia["phot_g_mean_mag"] < 18.0]
    gaia = gaia[np.nan_to_num(gaia["parallax"]) > 0]
    warning = len(gaia) == 0

    # Then propagate the Gaia coordinates to 2000, and find the best match to the
    # input coordinates
    if not warning:
        ra2015 = np.array(gaia["ra"]) * u.deg
        dec2015 = np.array(gaia["dec"]) * u.deg
        parallax = np.array(gaia["parallax"]) * u.mas
        pmra = np.array(gaia["pmra"]) * u.mas / u.yr
        pmdec = np.array(gaia["pmdec"]) * u.mas / u.yr
        c2015 = SkyCoord(
            ra=ra2015,
            dec=dec2015,
            distance=Distance(parallax=parallax, allow_negative=True),
            pm_ra_cosdec=pmra,
            pm_dec=pmdec,
            obstime=Time(2015.5, format="decimalyear"),
        )
        c2000 = c2015.apply_space_motion(dt=-15.5 * u.year)

        idx, sep, _ = coord.match_to_catalog_sky(c2000)

        # All objects
        id_all = gaia["source_id"]
        plx_all = np.array(gaia["parallax"])
        g_all = np.array(gaia["phot_g_mean_mag"])
        MG_all = 5 + 5 * np.log10(plx_all / 1000) + g_all
        bprp_all = np.array(gaia["bp_rp"])

        id_all = np.array(id_all)
        g_all = np.array(gaia["phot_g_mean_mag"])
        MG_all = np.array(MG_all)
        bprp_all = np.array(bprp_all)

        # The best match object
        best = gaia[idx]
        gaia_id = best["source_id"]

        MG = 5 + 5 * np.log10(best["parallax"] / 1000) + best["phot_g_mean_mag"]
        bprp = best["bp_rp"]

        gaia_id = int(gaia_id)
        G = float(best["phot_g_mean_mag"])
        MG = float(MG)
        bprp = float(bprp)

        # Coordinates for plotting
        radecs = np.vstack([c2000.ra, c2000.dec]).T
        coords = tpf.wcs.all_world2pix(radecs, 0.5)
        sizes = 128.0 / 2 ** ((g_all - best["phot_g_mean_mag"]))

    # Reference sample

    table = parse_single_table("SampleC.vot")
    data = table.array

    s_MG = (
        5
        + 5 * np.log10(table.array["parallax"] / 1000)
        + table.array["phot_g_mean_mag"]
    )
    s_bprp = table.array["bp_rp"]

    ################################

    #######  2-MINUTE DATA  ########

    print("Processing 2-minute exposure data points")

    slow_lc = tul.LCdata(TIC)

    slow_lc.read_data(infile)
    BJD_or = slow_lc.bjd
    flux_or = slow_lc.flux

    slow_lc.clean_data()
    if flag_lc == 1:
        ascii.write(
            [slow_lc.bjd, slow_lc.flux, slow_lc.flux_err],
            results_dir + "TIC%09d_lc.dat" % (TIC),
            names=["BJD", "RelativeFlux", "Error"],
            overwrite=True,
        )

    # Calculates the periodogram
    slow_lc.periodogram()
    if flag_ls == 1:
        ascii.write(
            [1 / slow_lc.freq, slow_lc.power],
            results_dir + "TIC%09d_ls.dat" % (TIC),
            names=["Period[h]", "Power"],
            overwrite=True,
        )

    print("Calculating phase to dominant peak diagrams")

    # Folds the data to the dominant peak
    slow_lc.phase_data(1.0)
    phase = slow_lc.phase
    flux_phased = slow_lc.flux_phased
    flux_err_phased = slow_lc.flux_err_phased
    flux_fit = slow_lc.flux_fit
    amp = slow_lc.amp
    # Folds the data to twice the dominant peak
    slow_lc.phase_data(2.0)
    phase2 = slow_lc.phase
    flux_phased2 = slow_lc.flux_phased
    flux_err_phased2 = slow_lc.flux_err_phased
    flux_fit2 = slow_lc.flux_fit
    amp2 = slow_lc.amp

    if flag_ph == 1:
        if flag_p2 == 1:
            ascii.write(
                [phase2, flux_phased2, flux_err_phased2],
                results_dir + "TIC%09d_phase.dat" % (TIC),
                names=["Phase", "RelativeFlux", "Error"],
                overwrite=True,
            )
        else:
            ascii.write(
                [phase, flux_phased, flux_err_phased],
                results_dir + "TIC%09d_phase.dat" % (TIC),
                names=["Phase", "RelativeFlux", "Error"],
                overwrite=True,
            )

    print("Creating 2-minute exposure graphical images")

    # Make general information graph
    plot = make_plot(
        slow_lc.freq,
        slow_lc.power,
        slow_lc.fap_001,
        BJD_or,
        flux_or,
        slow_lc.bjd,
        slow_lc.flux,
        phase,
        flux_phased,
        flux_fit,
        phase2,
        flux_phased2,
        flux_fit2,
        slow_lc.period,
        slow_lc.crowdsap,
        n_slow,
    )
    plot.savefig(results_dir + "TIC%09d.png" % (TIC))

    # Make a bigger version of the fast BJD graph
    fast_full_graph = make_expanded_graph(
        BJD_or, flux_or, slow_lc.bjd, slow_lc.flux, n_fast
    )
    fast_full_graph.savefig(results_dir + "TIC%09d_full.png" % (TIC))

    # Make an expanded version of the fast BJD graph
    fast_expanded_graph = make_expanded_graph(
        BJD_or, flux_or, slow_lc.bjd, slow_lc.flux, n_fast, (120, 30)
    )
    fast_expanded_graph.savefig(results_dir + "TIC%09d_expanded.png" % (TIC))

    if create_detailed_graphs:
        # Make an expanded and detailed version of the fast BJD graph
        fast_expanded_detailed_graph = make_expanded_graph(
            BJD_or, flux_or, slow_lc.bjd, slow_lc.flux, n_fast, (120, 30), 2
        )
        fast_expanded_detailed_graph.savefig(
            results_dir + "TIC%09d_expanded_detailed.png" % (TIC)
        )

        # Make an extremely expanded and detailed version of the fast BJD graph
        fast_expanded_detailed_graph = make_expanded_graph(
            BJD_or, flux_or, slow_lc.bjd, slow_lc.flux, n_fast, (240, 30), 2
        )
        fast_expanded_detailed_graph.savefig(
            results_dir + "TIC%09d_extremely_expanded_detailed.png" % (TIC)
        )

    # Close generated graphs after they are saved so they do not stay open in memory
    plt.close('all')

    ################################

    ######  20-SECOND DATA  ########

    if fast:
        print("Processing 20-second exposure data points")

        fast_lc = tul.LCdata(TIC)

        fast_lc.read_data(infile_fast)
        BJD_or = fast_lc.bjd
        flux_or = fast_lc.flux

        fast_lc.clean_data()
        if flag_lc == 1:
            ascii.write(
                [fast_lc.bjd, fast_lc.flux, fast_lc.flux_err],
                results_dir + "TIC%09d_lc_fast.dat" % (TIC),
                names=["BJD", "RelativeFlux", "Error"],
                overwrite=True,
            )

        # Calculates the periodogram
        fast_lc.periodogram()
        if flag_ls == 1:
            ascii.write(
                [1 / fast_lc.freq, fast_lc.power],
                results_dir + "TIC%09d_ls_fast.dat" % (TIC),
                names=["Period[h]", "Power"],
                overwrite=True,
            )

        print("Calculating phase to dominant peak diagrams")

        # Folds the data to the dominant peak
        fast_lc.phase_data(1.0)
        phase = fast_lc.phase
        flux_phased = fast_lc.flux_phased
        flux_err_phased = fast_lc.flux_err_phased
        flux_fit = fast_lc.flux_fit
        fast_amp = fast_lc.amp
        # Folds the data to twice the dominant peak
        fast_lc.phase_data(2.0)
        phase2 = fast_lc.phase
        flux_phased2 = fast_lc.flux_phased
        flux_err_phased2 = fast_lc.flux_err_phased
        flux_fit2 = fast_lc.flux_fit
        fast_amp2 = fast_lc.amp

        if flag_ph == 1:
            if flag_p2 == 1:
                ascii.write(
                    [phase2, flux_phased2, flux_err_phased2],
                    results_dir + "TIC%09d_phase_fast.dat" % (TIC),
                    names=["Phase", "RelativeFlux", "Error"],
                    overwrite=True,
                )
            else:
                ascii.write(
                    [phase, flux_phased, flux_err_phased],
                    results_dir + "TIC%09d_phase_fast.dat" % (TIC),
                    names=["Phase", "RelativeFlux", "Error"],
                    overwrite=True,
                )

        print("Creating 20-second exposure graphical images")

        # Make general information graph
        plot_fast = make_plot(
            fast_lc.freq,
            fast_lc.power,
            fast_lc.fap_001,
            BJD_or,
            flux_or,
            fast_lc.bjd,
            fast_lc.flux,
            phase,
            flux_phased,
            flux_fit,
            phase2,
            flux_phased2,
            flux_fit2,
            fast_lc.period,
            fast_lc.crowdsap,
            n_fast,
        )
        plot_fast.savefig(results_dir + "TIC%09d_fast.png" % (TIC))

        # Make a bigger version of the fast BJD graph
        fast_full_graph = make_expanded_graph(
            BJD_or, flux_or, fast_lc.bjd, fast_lc.flux, n_fast
        )
        fast_full_graph.savefig(results_dir + "TIC%09d_fast_full.png" % (TIC))

        # Make an expanded version of the fast BJD graph
        fast_expanded_graph = make_expanded_graph(
            BJD_or, flux_or, fast_lc.bjd, fast_lc.flux, n_fast, (120, 30)
        )
        fast_expanded_graph.savefig(results_dir + "TIC%09d_fast_expanded.png" % (TIC))

        if create_detailed_graphs:
            # Make an expanded and detailed version of the fast BJD graph
            fast_expanded_detailed_graph = make_expanded_graph(
                BJD_or, flux_or, fast_lc.bjd, fast_lc.flux, n_fast, (120, 30), 2
            )
            fast_expanded_detailed_graph.savefig(
                results_dir + "TIC%09d_fast_expanded_detailed.png" % (TIC)
            )

            # Make an extremely expanded and detailed version of the fast BJD graph
            fast_expanded_detailed_graph = make_expanded_graph(
                BJD_or, flux_or, fast_lc.bjd, fast_lc.flux, n_fast, (240, 30), 2
            )
            fast_expanded_detailed_graph.savefig(
                results_dir + "TIC%09d_fast_extremely_expanded_detailed.png" % (TIC)
            )

        # Close generated graphs after they are saved so they do not stay open in memory
        plt.close('all')

    ################################

    #########  WRITE LOG  ##########

    print("Finalizing logs for TIC %09d" % (TIC))

    log = open(results_dir + "TIC%09d.log" % (TIC), "w")
    log.write("TIC %09d\n\n" % (TIC))
    if warning:
        log.write("Warning! No object with measured parallax within 30 arcsec.\n")
    else:
        log.write("Gaia DR2 source_id = %20d\n" % (gaia_id))
        log.write("G = %6.3f, MG = %6.3f, bp_rp = %6.3f\n\n" % (G, MG, bprp))

    log.write("2-minute cadence data\n")
    log.write("Number of sectors: %2d\n" % (len(infile)))
    log.write("CROWDSAP: %5.3f\n" % (np.mean(slow_lc.crowdsap)))

    if flag_p2 == 1:
        log.write(
            "Period = %9.5f hours, Amplitude =  %7.5f per cent\n"
            % (2.0 * slow_lc.period, 100 * abs(amp2))
        )
    else:
        log.write(
            "Best period = %9.5f hours, Amplitude =  %7.5f per cent\n"
            % (slow_lc.period, 100 * abs(amp))
        )
    log.write("FAP = %7.5e\n\n" % (slow_lc.fap_p))

    if fast:
        log.write("20-second cadence data\n")
        log.write("Number of sectors: %2d\n" % (len(infile_fast)))
        log.write("CROWDSAP: %5.3f\n" % (np.mean(fast_lc.crowdsap)))
        if flag_p2 == 1:
            log.write(
                "Period = %9.5f hours, Amplitude =  %7.5f per cent\n"
                % (2.0 * fast_lc.period, 100 * abs(fast_amp2))
            )
        else:
            log.write(
                "Best period = %9.5f hours, Amplitude =  %7.5f per cent\n"
                % (fast_lc.period, 100 * abs(fast_amp))
            )
        log.write("FAP = %7.5e\n\n" % (fast_lc.fap_p))
    else:
        log.write("No fast-candence data available.\n\n")

    if len(gaia) > 0:
        log.write("Other G < 18. matches within 5 pixels:\n")
        log.write("source_id            G       MG    bp_rp\n")
        for i in range(0, len(gaia)):
            if i != idx:
                log.write(
                    "%20d %6.3f %6.3f %6.3f\n"
                    % (id_all[i], g_all[i], MG_all[i], bprp_all[i])
                )

    log.close()

    ################################

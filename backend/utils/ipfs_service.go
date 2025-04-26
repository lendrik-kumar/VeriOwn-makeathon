package utils

import (
	"bytes"
	"fmt"
	"io"
	"os"

	shell "github.com/ipfs/go-ipfs-api"
)

var ipfsShell *shell.Shell

func InitIPFSShell(ipfsNodeURL string) {
	if ipfsNodeURL == "" {
		ipfsNodeURL = "localhost:5001"
	}
	ipfsShell = shell.NewShell(ipfsNodeURL)
}

func UploadToIPFS(filePath string) (string, error) {
	file, err := os.Open(filePath)
	if err != nil {
		return "", fmt.Errorf("failed to open file: %w", err)
	}
	defer file.Close()

	// Read the file content
	fileContent, err := io.ReadAll(file)
	if err != nil {
		return "", fmt.Errorf("failed to read file: %w", err)
	}

	// Upload to IPFS
	cid, err := ipfsShell.Add(bytes.NewReader(fileContent))
	if err != nil {
		return "", fmt.Errorf("failed to upload to IPFS: %w", err)
	}

	return cid, nil
}

func GetFromIPFS(cid string) (io.ReadCloser, error) {
	if ipfsShell == nil {
		return nil, fmt.Errorf("IPFS shell not initialized")
	}

	reader, err := ipfsShell.Cat(cid)
	if err != nil {
		return nil, fmt.Errorf("failed to retrieve from IPFS: %w", err)
	}

	return reader, nil
}

func DownloadFromIPFS(cid string, outputPath string) error {
	reader, err := GetFromIPFS(cid)
	if err != nil {
		return err
	}
	defer reader.Close()

	// create file where the contents should be copied to
	outputFile, err := os.Create(outputPath)
	if err != nil {
		return fmt.Errorf("failed to create output file: %w", err)
	}
	defer outputFile.Close()

	// Copy the content from IPFS to the file
	_, err = io.Copy(outputFile, reader)
	if err != nil {
		return fmt.Errorf("failed to write content to file: %w", err)
	}

	return nil
}
